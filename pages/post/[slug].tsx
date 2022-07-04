import { GetStaticProps } from "next";
import { interpolateAs } from "next/dist/shared/lib/router/router";
import PortableText from "react-portable-text";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity"
import { Post } from "../../typings";
import { useForm, SubmitHandler } from "react-hook-form"

interface IFormInput{
    _id: string;
    name: string;
    email: string;
    comment: string;
}

interface Props{
    post: Post;
}


function Post({post}: Props){

    const { register, handleSubmit, formState: { errors },} = useForm<IFormInput>(); //<> is the template, thus the useForm only can be assigned here to the IFormInput interface

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {console.log(data)};

    return (
    <main>
        <Header />

        <img className="w-full h-40 object-cover" src={urlFor(post.mainImage).url()!} alt="" />

        <article className="max-w-3xl mx-auto p-5">
            <h1 className="text-3xl mt-10 mb-3"></h1>
            <h2 className="text-xl font-light text-gray-500 mb-2">{post.description}</h2>

            <div>
                <img className="h-10 w-10 rounded-full" src={urlFor(post.author.image).url()!} alt=""/>
                <p className="font-extralight text-sm">Blog post by <span className="text-green-600">{post.author.name}</span> - Published at {" "}{new Date(post._createdAt).toLocaleString()}</p>
            </div>

            <div className="mt-10">
                <PortableText 
                className=""
                dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!} 
                content={post.body}
                />
            </div>
        </article>

        <hr className="max-w-lg my-5 mx-auto border border-yellow-500"/>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5 my-10 max-w-2xl mx-auto mb-10 ">
            <h3 className="text-sm text-yellow-500">Enojoyed this article?</h3>
            <h4 className="text-3xl font-bold">Leave a comment below!</h4>
            <hr className="py-3 mt-2"/>

            <input {...register("_id")} type="hidden" name="_id" value={post._id}/>

            <label className="block mb-5">
                <span className="text-gray-700">Name</span>
                <input {...register("name", {required: true})} className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 " placeholder="type comment" type="text"/>
            </label>
            <label className="block mb-5">
                <span className="text-gray-700">Email</span>
                <input {...register("name", {required: true})} className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500" placeholder="type comment" type="email"/>
            </label>
            <label className="block mb-5">
                <span className="text-gray-700">Comment</span>
                <textarea {...register("name", {required: true})} className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring" placeholder="type comment" rows={8}/>
            </label>

            <div className="flex flex-col p-5">
            {errors.name && (<span className="text-red-500"> - The Name Field is required</span>)}
            {errors.comment && (<span className="text-red-500"> - The Comment Field is required</span>)}
            {errors.email && (<span className="text-red-500"> - The Email Field is required</span>)}
            </div>

            <input type="submit" className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold px-4 py-2 cursor-pointer rounded"/>
        </form>



        {/* ERRORS */}
       
    </main>
    )
}

export default Post;



export const getStaticPaths  = async () => {
    const query = `*[_type = "post"]{
        _id,
        slug{
            current
        }
    }`;

    const posts = await sanityClient.fetch(query);

    const paths = posts.map((post: Post) => ({
        parms:{
            slug: post.slug.current
        }
    }));

    return {
        paths,
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author->{
            name,
            image
        },
        "comments": *[
            _type == "comment" && post._ref == ^._id && approved == true],
            description,
            mainImage,
            slug,
            body

        ]
    }`

    const post = await sanityClient.fetch(query, {
        slug: params?.slug,
    });

    if (!post){
        return{
            notFound: true
        }
    }
    return {
        props:{
            post,
        },
        revalidate: 60
    };
}