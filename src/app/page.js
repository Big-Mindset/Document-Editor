"use client"
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from '@/components/Navbar';
import Documents from '@/components/Documents';

export default function Home() {
  let {data,isPending} = authClient.useSession()
  let router = useRouter()
 useEffect(() => {
  if (!isPending && !data) {
    router.push("/auth/login");
  }
}, [data, isPending, router]);

  return (
   <div className='grid grid-rwos-2 gap-6 h-dvh'>
    <Navbar user={data?.user} />
    <Documents />
   </div>
  );
}




// const theme = {
//   // Theme styling goes here
//   //...
// }

// // Catch any errors that occur during Lexical updates and log them
// // or throw them as needed. If you don't throw them, Lexical will
// // try to recover gracefully without losing user data.
// function onError(error) {
//   console.error(error);
// }

// function Editor() {
//   const initialConfig = {
//     namespace: 'MyEditor',
//     theme,
//     onError,
//     nodes : [HeadingNode,CodeNode,CodeHighlightNode]
//   };

//   return (
//     <LexicalComposer initialConfig={{initialConfig}}>
//       <RichTextPlugin
//         contentEditable={
//           <ContentEditable
//             aria-placeholder={'Enter some text...'}
//             className='w-full h-60 m-9 relative border-0 outline-0'
//             placeholder={<div className="top-10 absolute left-10 ">Enter some text...</div>}
//           />
//         }
//         ErrorBoundary={LexicalErrorBoundary}
//       />
//       <HistoryPlugin />
//       <AutoFocusPlugin />
//     </LexicalComposer>
//   );
// }