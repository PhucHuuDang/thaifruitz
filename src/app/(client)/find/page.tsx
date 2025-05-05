import Maps from "@/components/global-components/maps";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// const Maps = dynamic(() => import("@/components/global-components/maps"), {
//   loading: () => (
//     <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed">
//       <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
//     </div>
//   ),
// });

const FindPage = () => {
  return (
    <div className="h-auto py-20 bg-green-500">
      {/* <SidebarFilter /> */}

      <span>find page</span>

      {/* <Maps /> */}

      {/* <Blog
        editorSerializedState={content ? JSON.parse(content) : undefined}
        // editorState={JSON.stringify(content) as EditorState}
        readOnly
        maxLength={2500}
      /> */}
      {/* 
<LexicalComposer initialConfig={{readOnly: true}}>
  <RichTextPlugin
    contentEditable={
      <ContentEditable />
    }
  />
</LexicalComposer> */}
    </div>
  );
};

export default FindPage;
