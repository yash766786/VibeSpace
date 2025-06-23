// import { transformImage } from "../../utils/features";

// export const RenderAttachment = ({ type, url }) => {
//   switch (type) {
//     case "image":
//       return (
//         <div className="relative aspect-[6/5]">
//           <img
//             src={transformImage(url, 600)}
//             alt="post"
//             className="w-[96%] h-full object-cover"
//             loading="lazy"
//           />
//           <a
//             href={url}
//             download
//             className="absolute bottom-1 right-6 bg-inherit p-1 rounded-full shadow"
//             title="Download Image"
//           >
//             ⬇️
//           </a>
//         </div>
//       );
//     case "video":
//       return (
//         <video
//           src={transformImage(url)}
//           preload="auto"
//           controls
//           alt="post"
//           className="max-w-[96%] h-full object-cover"
//           download
//         />
//       );
//     case "audio":
//       return <audio src={url} preload="none" controls download />;
//     case "document":
//       return (
//         <a
//           href={url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-500 hover:underline"
//           download
//         >
//           📄 View Document
//         </a>
//       );
//     default:
//       return (
//         <a href={url} download className="text-blue-500 hover:underline">
//           ⬇️ Download File
//         </a>
//       );
//   }
// };

import { Download, FileAudio } from "lucide-react";
import { motion } from "framer-motion";
import { transformImage } from "../../utils/features.js"; // adjust path as needed
import { memo } from "react";

export const RenderAttachment = memo(({ type, url }) => {
  const MotionWrapper = ({ children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative w-full flex justify-center"
    >
      {children}
    </motion.div>
  );

  switch (type) {
    case "image":
      return (
        <MotionWrapper>
          <div className="relative aspect-[6/5] w-full rounded-lg overflow-hidden shadow-md max-w-md">
            <img
              src={transformImage(url, 600)}
              alt="attachment"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <a
              href={url}
              download
              className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100 transition"
              title="Download Image"
            >
              <Download className="w-5 h-5 text-gray-800" />
            </a>
          </div>
        </MotionWrapper>
      );

    case "video":
      return (
        <MotionWrapper>
          <div className="w-auto rounded-lg  shadow-md">
            <video
              src={transformImage(url)}
              controls
              className="w-full rounded h-full"
              preload="auto"
              download
            />
          </div>
        </MotionWrapper>
      );

    case "audio":
      return (
        <MotionWrapper>
          <div className="flex items-center gap-2 bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-md">
            <FileAudio className="w-6 h-6 text-blue-500" />
            <audio src={url} preload="none" controls className="w-full" />
          </div>
        </MotionWrapper>
      );

    // case "document":
    //   return (
    //     <MotionWrapper>
    //       <a
    //         href={url}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         download
    //         className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium"
    //       >
    //         <FileText className="w-5 h-5" />
    //         View Document
    //         <ExternalLink className="w-4 h-4" />
    //       </a>
    //     </MotionWrapper>
    //   );

    default:
      return (
        <MotionWrapper>
          <a
            href={url}
            download
            className="flex items-center gap-2 text-blue-500 hover:underline text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Download File
          </a>
        </MotionWrapper>
      );
  }
})
