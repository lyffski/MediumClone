import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { groq } from 'next-sanity'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/Header'
import { sanityClient, urlFor } from "../sanity"
import { Post } from '../typings'
//import map from "react"

interface Props {
  posts: [Post]; //same as: Post[]
}

export default function Home({posts}: Props) {

  console.log("test", posts)

  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>This is Medium 2.0</h1>

      <Header />

      <div className='flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0'>
        <div className='px-10 space-y-5'>
          <h1 className='text-6xl max-w-xl font-serif'><span className="underline decoration-black decoratation-4">Medium</span> is a place to write, read and connect</h1>
          <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa id modi laudantium unde</h2>
        </div>

        <div>
          <img className="hidden md:inline-flex h-32 lg:h-full" src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png" alt="" />
        </div>
      </div>

      {/* Posts */}
      <div className='grid gird-clos-1 sm:gird-cols-2 lg:gird-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className='group cursor-pointer overflow-hidden'>
              <img className='-60 w-full object-cover group-hover:scale-105 transition-all duration-200 ease-in-out' src={
                urlFor(post.mainImage).url()!
              } alt=""/>
              <div className='flex justify-between p-5 bg-white'>
                <div>
                  <p className='text-lg font-bold'>{post.title}</p>
                  <p className='text-xs'>{post.description} by {post.author.name}</p>
                </div>
                <img className="h-12 w-12 rounded-full" src={urlFor(post.author.image).url()!} alt=""/>
              </div>
            </div>
        </Link>
        ))}
      </div>
        

      </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const query = groq`*[_type == "post"]{
    _id,
    title,
    author-> {
      name,
      image
    },
    description,
    mainImage,
    slug
  }`;

  const posts = await sanityClient.fetch(query)

  return {
    props:{posts}
  }
};
