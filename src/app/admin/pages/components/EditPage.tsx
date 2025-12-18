"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Bold,
  Italic,
  UnderlineIcon,
  LinkIcon,
  ImageIcon,
  List,
  ListOrdered,
  IndentIcon,
  OutdentIcon,
  Loader2,
  Upload,
  X,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { TableSelector } from "../../components/table-selector";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import ImageResize from "tiptap-extension-resize-image";
import { default as NextImage } from "next/image";

interface Page {
  id: number;
  title: string;
  slug: string;
  seoTitle: string;
  metaDesc: string;
  canonicalUrl: string;
  content: string;
  featuredImage: string;
  author: string;
  published: boolean;
}

const EditPage = ({ page }: { page: Page }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<Page>(page);

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Paragraph,
      StarterKit.configure({
        document: false,
        text: false,
        paragraph: false,
        bulletList: false,
      }),
      Underline,
      Link,
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            width: {
              default: "100%",
              renderHTML: (attributes) => ({
                width: attributes.width,
              }),
            },
          };
        },
      }),
      ImageResize,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        controls: false,
      }),
      BulletList.configure({
        itemTypeName: "listItem",
        HTMLAttributes: {
          class: "bullet-list",
        },
      }),
      ListItem,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: page.content,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({
        ...prev,
        content: editor.getHTML(),
      }));
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[300px] max-h-[500px] overflow-y-auto tiptap",
      },
    },
  });

  useEffect(() => {
    if (page.featuredImage) {
      setPreviewImage(page.featuredImage);
    }
  }, [page.featuredImage]);

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    setFormData((prev) => ({
      ...prev,
      featuredImage: "",
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.featuredImage;

      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!response.ok) throw new Error("Image upload failed");

        const data = await response.json();
        imageUrl = data.url;
      }

      const pageResponse = await fetch(`/api/pages/${page.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          featuredImage: imageUrl,
        }),
      });

      if (!pageResponse.ok) throw new Error("Failed to update page");

      router.push("/admin/pages/all-pages");
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 md:p-8 max-w-6xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/ /g, "-"),
                    }));
                  }}
                  placeholder="Enter page title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      slug: e.target.value,
                    }));
                  }}
                  placeholder="page-url-slug"
                />
              </div>

              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      author: e.target.value,
                    }));
                  }}
                  placeholder="Enter author name"
                />
              </div>

              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      seoTitle: e.target.value,
                    }));
                  }}
                  placeholder="SEO optimized title"
                />
              </div>

              <div>
                <Label htmlFor="metaDesc">Meta Description</Label>
                <Textarea
                  id="metaDesc"
                  value={formData.metaDesc}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      metaDesc: e.target.value,
                    }));
                  }}
                  placeholder="Enter meta description"
                  className="h-24"
                />
              </div>

              <div>
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  value={formData.canonicalUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      canonicalUrl: e.target.value,
                    }))
                  }
                  placeholder="Enter canonical URL"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <Label>Featured Image</Label>
                <div className="mt-2 flex items-center gap-4">
                  {(previewImage || formData.featuredImage) && (
                    <div className="relative w-32 h-32 rounded-md overflow-hidden">
                      <NextImage
                        src={
                          previewImage ||
                          formData.featuredImage ||
                          "/placeholder.svg"
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                        width={128}
                        height={128}
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Label
                    htmlFor="image"
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    {previewImage || formData.featuredImage
                      ? "Change Image"
                      : "Upload Image"}
                  </Label>
                </div>
              </div>
            </div>
          </div>
          {/* Content Editor */}
          <div className="mt-6">
            <Label>Content</Label>
            <Card className="mt-2">
              <CardContent className="p-0">
                <div className="border-b p-2 flex flex-wrap gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        {editor?.isActive("heading", { level: 1 })
                          ? "Heading 1"
                          : editor?.isActive("heading", { level: 2 })
                          ? "Heading 2"
                          : editor?.isActive("heading", { level: 3 })
                          ? "Heading 3"
                          : editor?.isActive("heading", { level: 4 })
                          ? "Heading 4"
                          : "Paragraph"}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() =>
                          editor?.chain().focus().setParagraph().run()
                        }
                        className={
                          editor?.isActive("paragraph") ? "bg-accent" : ""
                        }
                      >
                        <span className="text-sm">Paragraph</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 1 })
                            .run()
                        }
                        className={
                          editor?.isActive("heading", { level: 1 })
                            ? "bg-accent"
                            : ""
                        }
                      >
                        <span className="text-2xl font-bold">Heading 1</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run()
                        }
                        className={
                          editor?.isActive("heading", { level: 2 })
                            ? "bg-accent"
                            : ""
                        }
                      >
                        <span className="text-xl font-bold">Heading 2</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 3 })
                            .run()
                        }
                        className={
                          editor?.isActive("heading", { level: 3 })
                            ? "bg-accent"
                            : ""
                        }
                      >
                        <span className="text-lg font-bold">Heading 3</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 4 })
                            .run()
                        }
                        className={
                          editor?.isActive("heading", { level: 4 })
                            ? "bg-accent"
                            : ""
                        }
                      >
                        <span className="text-base font-bold">Heading 4</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={editor?.isActive("bold") ? "bg-slate-200" : ""}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={editor?.isActive("italic") ? "bg-slate-200" : ""}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editor?.chain().focus().toggleUnderline().run()
                    }
                    className={
                      editor?.isActive("underline") ? "bg-slate-200" : ""
                    }
                  >
                    <UnderlineIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const url = window.prompt("Enter the URL");
                      if (url) {
                        editor?.chain().focus().setLink({ href: url }).run();
                      }
                    }}
                    className={editor?.isActive("link") ? "bg-slate-200" : ""}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = async (e) => {
                            const file = (e.target as HTMLInputElement)
                              .files?.[0];
                            if (file) {
                              const formData = new FormData();
                              formData.append("file", file);
                              try {
                                const response = await fetch("/api/upload", {
                                  method: "POST",
                                  body: formData,
                                });
                                if (!response.ok)
                                  throw new Error("Upload failed");
                                const data = await response.json();
                                editor
                                  ?.chain()
                                  .focus()
                                  .setImage({ src: data.url })
                                  .run();
                              } catch (error) {
                                console.error("Error uploading image:", error);
                              }
                            }
                          };
                          input.click();
                        }}
                      >
                        Upload from computer
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          const url = window.prompt("Enter the image URL");
                          if (url) {
                            editor
                              ?.chain()
                              .focus()
                              .setImage({ src: url })
                              .run();
                          }
                        }}
                      >
                        Insert via URL
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editor?.chain().focus().toggleBulletList().run()
                    }
                    className={
                      editor?.isActive("bulletList") ? "bg-slate-200" : ""
                    }
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editor?.chain().focus().toggleOrderedList().run()
                    }
                    className={
                      editor?.isActive("orderedList") ? "bg-slate-200" : ""
                    }
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <TableSelector
                    onSelect={(rows, cols) => {
                      editor
                        ?.chain()
                        .focus()
                        .insertTable({ rows, cols, withHeaderRow: true })
                        .run();
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editor?.chain().focus().splitListItem("listItem").run()
                    }
                    disabled={!editor?.can().splitListItem("listItem")}
                  >
                    Split list
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editor?.chain().focus().sinkListItem("listItem").run()
                    }
                    disabled={!editor?.can().sinkListItem("listItem")}
                  >
                    <IndentIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editor?.chain().focus().liftListItem("listItem").run()
                    }
                    disabled={!editor?.can().liftListItem("listItem")}
                  >
                    <OutdentIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("left").run()
                    }
                    className={
                      editor?.isActive({ textAlign: "left" })
                        ? "bg-slate-200"
                        : ""
                    }
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("center").run()
                    }
                    className={
                      editor?.isActive({ textAlign: "center" })
                        ? "bg-slate-200"
                        : ""
                    }
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("right").run()
                    }
                    className={
                      editor?.isActive({ textAlign: "right" })
                        ? "bg-slate-200"
                        : ""
                    }
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("justify").run()
                    }
                    className={
                      editor?.isActive({ textAlign: "justify" })
                        ? "bg-slate-200"
                        : ""
                    }
                  >
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                </div>
                <EditorContent editor={editor} className="p-4" />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default EditPage;
