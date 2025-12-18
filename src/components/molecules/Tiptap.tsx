"use client";

import React, { useCallback, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Editor, NodeViewRendererProps } from "@tiptap/core";

// Tiptap extensions
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import OrderedList from "@tiptap/extension-ordered-list";
import Dropcursor from "@tiptap/extension-dropcursor";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

// Icons from react-icons
import {
  FaListUl,
  FaListOl,
  FaMinus,
  FaImage,
  FaParagraph,
  FaCheckSquare,
  FaBold,
  FaItalic,
  FaLink,
  FaUnderline,
} from "react-icons/fa";

import { MdFilter1, MdFilter2, MdFilter3 } from "react-icons/md";

interface TiptapEditorProps {
  content?: string;
  onUpdate?: (props: { editor: Editor }) => void;
}
interface TiptapEditorProps {
  content?: string;
  onUpdate?: (props: { editor: Editor }) => void;
}

// Define custom Image extension with resizing
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      // eslint-disable-next-line
      // @ts-ignore: Ignoring TS error for addAttributes() call.
      ...Image.config.addAttributes(),
      width: {
        default: "100%",
        renderHTML: (attributes) => ({
          width: attributes.width,
        }),
      },
      height: {
        default: "auto",
        renderHTML: (attributes) => ({
          height: attributes.height,
        }),
      },
    };
  },
  addNodeView() {
    return ({ node, getPos }: NodeViewRendererProps) => {
      const container = document.createElement("div");
      container.className = "image-resizer";

      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.width = node.attrs.width;
      img.height = node.attrs.height;
      img.className = "resize-image";

      const resizeHandle = document.createElement("div");
      resizeHandle.className = "resize-handle";

      let startWidth: number;
      let startX: number;

      const onMouseDown = (event: MouseEvent) => {
        startX = event.clientX;
        startWidth = img.width;

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      };

      const onMouseMove = (event: MouseEvent) => {
        const diff = event.clientX - startX;
        const newWidth = startWidth + diff;

        if (newWidth > 100) {
          img.width = newWidth;
          if (typeof getPos === "function") {
            const pos = getPos();
            const transaction = this.editor.state.tr.setNodeAttribute(
              pos,
              "width",
              newWidth
            );
            this.editor.view.dispatch(transaction);
          }
        }
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      resizeHandle.addEventListener("mousedown", onMouseDown);

      container.append(img, resizeHandle);
      return {
        dom: container,
        destroy: () => {
          resizeHandle.removeEventListener("mousedown", onMouseDown);
        },
      };
    };
  },
});

// Reusable toolbar button component
const ToolbarButton = ({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: React.MouseEventHandler;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    onClick={(e) => {
      e.preventDefault(); // Prevent form submission
      onClick(e);
    }}
    type="button" // Important: Explicitly set button type
    className={`p-2 rounded hover:bg-gray-200 ${active ? "bg-blue-200" : ""}`}
    title={title}
  >
    {children}
  </button>
);

// Editor configuration constants
const editorAttributes =
  "ProseMirror prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none border min-h-[150px] w-[100%] p-4";

const editorExtensions = [
  Document,
  Paragraph,
  Text,
  BulletList,
  ListItem,
  HorizontalRule,
  ResizableImage,
  OrderedList,
  Dropcursor,
  TaskList,
  TaskItem.configure({ nested: true }),
  Heading.configure({ levels: [1, 2, 3] }),
  Bold,
  Italic,
  Underline,
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
    protocols: ["http", "https"],
    isAllowedUri: (url, ctx) => {
      try {
        const parsedUrl = url.includes(":")
          ? new URL(url)
          : new URL(`${ctx.defaultProtocol}://${url}`);
        if (!ctx.defaultValidate(parsedUrl.href)) {
          return false;
        }
        const disallowedProtocols = ["ftp", "file", "mailto"];
        const protocol = parsedUrl.protocol.replace(":", "");
        if (disallowedProtocols.includes(protocol)) {
          return false;
        }
        const allowedProtocols = ctx.protocols.map((p) =>
          typeof p === "string" ? p : p.scheme
        );
        if (!allowedProtocols.includes(protocol)) {
          return false;
        }
        const disallowedDomains = [
          "example-phishing.com",
          "malicious-site.net",
        ];
        const domain = parsedUrl.hostname;
        return !disallowedDomains.includes(domain);
      } catch {
        return false;
      }
    },
    shouldAutoLink: (url) => {
      try {
        const parsedUrl = url.includes(":")
          ? new URL(url)
          : new URL(`https://${url}`);
        const disallowedDomains = [
          "example-no-autolink.com",
          "another-no-autolink.com",
        ];
        return !disallowedDomains.includes(parsedUrl.hostname);
      } catch {
        return false;
      }
    },
  }),
];

// Add required CSS
// const imageResizeStyles = `
//   .image-resizer {
//     position: relative;
//     display: inline-block;
//     max-width: 100%;
//   }

//   .resize-image {
//     display: block;
//     max-width: 100%;
//     height: auto;
//   }

//   .resize-handle {
//     position: absolute;
//     bottom: 0;
//     right: 0;
//     width: 10px;
//     height: 10px;
//     background-color: #0096fd;
//     cursor: se-resize;
//     border-radius: 2px;
//   }
// `;

export default function TiptapEditor({ content, onUpdate }: TiptapEditorProps) {
  // const editor = useEditor({
  //   editorProps: {
  //     attributes: {
  //       class: editorAttributes,
  //     },
  //   },
  //   extensions: editorExtensions,
  //   content: content || "",
  //   onUpdate: onUpdate,
  // });
  // Reference for hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize the editor
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: editorAttributes,
      },
    },
    extensions: editorExtensions,
    content: content || "",
    onUpdate: onUpdate,
    // content: `
    //   <ul>
    //     <li>A list item</li>
    //     <li>And another one</li>
    //   </ul>
    // `,
    immediatelyRender: false, // Prevent immediate render during SSR
  });

  // Add styles to document head
  React.useEffect(() => {
    const style = document.createElement("style");
    // style.textContent = imageResizeStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Set or unset a link based on user input
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert("An unknown error occurred");
      }
    }
  }, [editor]);

  // Handle image file uploads
  const uploadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (editor && typeof reader.result === "string") {
          editor
            .chain()
            .focus()
            .setImage({
              src: reader.result,
              // eslint-disable-next-line
              // @ts-ignore: Ignoring TS error for addAttributes() call.
              width: 300, // Default width for new images
              height: "auto",
            })
            .run();
        }
      };
      reader.readAsDataURL(file);
      // Reset file input value so same file can be uploaded again if needed
      e.target.value = "";
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <div className="max-w-4xl mx-auto  ">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-4 bg-gray-100 rounded shadow">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Toggle Bullet List"
        >
          <FaListUl size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Toggle Ordered List"
        >
          <FaListOl size={18} />
        </ToolbarButton>

        {/* Heading buttons */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          title="Toggle Heading 1"
        >
          <MdFilter1 size={20} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Toggle Heading 2"
        >
          <MdFilter2 size={20} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Toggle Heading 3"
        >
          <MdFilter3 size={20} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Insert Horizontal Rule"
          active={undefined}
        >
          <FaMinus size={18} />
        </ToolbarButton>

        {/* Image Upload */}
        <div>
          <ToolbarButton
            onClick={() => fileInputRef.current?.click()}
            title="Upload Image"
          >
            <FaImage size={18} />
          </ToolbarButton>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={uploadImage}
            style={{ display: "none" }}
          />
        </div>

        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive("paragraph")}
          title="Paragraph"
        >
          <FaParagraph size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          active={editor.isActive("taskList")}
          title="Toggle Task List"
        >
          <FaCheckSquare size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Toggle Bold"
        >
          <FaBold size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Toggle Italic"
        >
          <FaItalic size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={setLink}
          active={editor.isActive("link")}
          title="Set Link"
        >
          <FaLink size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Toggle Underline"
        >
          <FaUnderline size={18} />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
