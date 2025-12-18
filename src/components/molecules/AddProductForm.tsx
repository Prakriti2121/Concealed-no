"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import TiptapEditor from "./Tiptap";
import toast from "react-hot-toast";

// Define the base schema with all fields as initially required
const productSchema = z.object({
  title: z.string().optional(),
  // Wine fields
  isNew: z.boolean().optional(),
  availableOnlyOnline: z.boolean().optional(),
  organic: z.boolean().optional(),
  featured: z.boolean().optional(),

  // Product details
  productCode: z.string().optional(),
  vintage: z.string().optional(),
  price: z.number().optional(),

  // Additional Product Info
  largeImage: z.instanceof(File).optional(), // Make largeImage optional
  buyLink: z.string().optional(),
  sortiment: z.string().optional(),
  tagLine: z.string().optional(),
  // producerDescription: z.string().optional(),
  producerDescription: z.string().optional(), // This will store HTML content
  producerUrl: z.string().optional(),
  region: z.string().optional(),
  // For MySQL, taste is stored as JSON (array of strings)
  taste: z.preprocess((val: unknown) => {
    if (typeof val === "string") {
      // Split by commas, trim whitespace, and filter out any empty strings
      return val
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");
    }
    return val;
  }, z.array(z.string()).optional()),
  awards: z.string().optional(),
  additionalInfo: z.string().optional(),

  // Food combinations (booleans)
  vegetables: z.boolean().optional(),
  roastedVegetables: z.boolean().optional(),
  softCheese: z.boolean().optional(),
  hardCheese: z.boolean().optional(),
  starches: z.boolean().optional(),
  fish: z.boolean().optional(),
  richFish: z.boolean().optional(),
  whiteMeatPoultry: z.boolean().optional(),
  lambMeat: z.boolean().optional(),
  porkMeat: z.boolean().optional(),
  redMeatBeef: z.boolean().optional(),
  gameMeat: z.boolean().optional(),
  curedMeat: z.boolean().optional(),
  sweets: z.boolean().optional(),

  // Other specifications
  bottleVolume: z.number().optional(),
  alcohol: z.number().optional(),
  composition: z.string().optional(),
  closure: z.string().optional(),
});

// Make all fields optional by applying the .partial() method

// Create a type based on the schema
type ProductFormValues = z.infer<typeof productSchema>;

export default function AddProductForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  // Add cleanup function
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Initialize the form with default values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      isNew: false,
      availableOnlyOnline: false,
      organic: false,
      featured: false,
      productCode: "",
      vintage: "",
      price: 0,
      largeImage: undefined,
      buyLink: "",
      sortiment: "",
      tagLine: "",
      producerDescription: "",
      producerUrl: "",
      region: "",
      taste: [],
      awards: "",
      additionalInfo: "",
      vegetables: false,
      roastedVegetables: false,
      softCheese: false,
      hardCheese: false,
      starches: false,
      fish: false,
      richFish: false,
      whiteMeatPoultry: false,
      lambMeat: false,
      porkMeat: false,
      redMeatBeef: false,
      gameMeat: false,
      curedMeat: false,
      sweets: false,
      bottleVolume: 0,
      alcohol: 0,
      composition: "",
      closure: "",
    },
  });

  // Submission handler
  const onSubmit = async (data: ProductFormValues) => {
    try {
      // Create FormData object
      const formData = new FormData();
      // formData.append("producerDescription", data.producerDescription || "");
      if (data.producerDescription) {
        formData.append("producerDescription", data.producerDescription);
      }

      // Handle other fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "producerDescription") {
          // Skip as we already handled it
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value instanceof File) {
            formData.append(key, value);
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        }
      });

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      await response.json();

      toast.success("Product created successfully");
      router.push("/admin/wines");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error creating product");
      toast.error("Error creating product");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <hr />
        <p className="text-xl font-bold">Wine Fields</p>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isNew"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">New</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableOnlyOnline"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">
                  Available Only Online
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">Organic</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">Featured</FormLabel>
              </FormItem>
            )}
          />
        </div>
        {/* Product Details */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Title</FormLabel>
                <FormControl>
                  <Input type="string" placeholder="Product Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Code</FormLabel>
                <FormControl>
                  <Input placeholder="Product Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vintage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vintage</FormLabel>
                <FormControl>
                  <Input placeholder="Vintage" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Price"
                    // Make sure the value is not undefined
                    value={field.value ?? ""}
                    onChange={(e) => {
                      // If the input is empty, you might want to set it to an empty string or a default number.
                      // Here, we'll convert the value to a float, or set it to empty if the input is empty.
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? "" : Number.parseFloat(value)
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sortiment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sortiment</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sortiment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tillfälliga sortimentet">
                        Tillfälliga sortimentet
                      </SelectItem>
                      <SelectItem value="Beställning sortimentet">
                        Beställning sortimentet
                      </SelectItem>
                      <SelectItem value="Exklusiva sortimentet">
                        Exklusiva sortimentet
                      </SelectItem>
                      <SelectItem value="Fasta Sortimentet">
                        Fasta Sortimentet
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tagLine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tag Line</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Tag Line" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="producerUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Producer</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Producer"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Region" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taste"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taste</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., sweet, savory, spicy"
                    {...field} // This will pass value and onChange from react-hook-form
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="awards"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Awards</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Awards" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Info</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Additional Info" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Wine Fields (Switches for booleans) */}

        {/* Additional Product Info */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="largeImage"
            // @typescript-eslint/no-unused-vars
            render={({
              field: {
                onChange,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                value,
                ...field
              },
            }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Input
                      className="cursor-pointer"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                          // Create preview
                          const objectUrl = URL.createObjectURL(file);
                          setPreviewUrl(objectUrl);
                        }
                      }}
                      {...field}
                    />
                    {previewUrl && (
                      <div className="relative w-40 h-40">
                        <Image
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="buyLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buy Link URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/buy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Producer Description (Textarea) */}
        {/* <FormField
          control={form.control}
          name="producerDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Producer Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="producerDescription"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Producer Description</FormLabel>
              <FormControl>
                <div className="border rounded-md min-h-[200px]">
                  <TiptapEditor
                    content={field.value}
                    onUpdate={({ editor }) => {
                      field.onChange(editor.getHTML());
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Food Combinations (Checkboxes) */}
        <hr />
        <p className="text-xl font-bold">Food Combinations</p>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="vegetables"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">Vegetables</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roastedVegetables"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">
                  Roasted Vegetables
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="softCheese"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">Soft Cheese</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hardCheese"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">Hard Cheese</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="starches"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">Starches</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fish"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">Fish</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="richFish"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">Rich Fish</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whiteMeatPoultry"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">
                  White Meat / Poultry
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lambMeat"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">Lamb Meat</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="porkMeat"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">Pork Meat</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="redMeatBeef"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">
                  Red Meat / Beef
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gameMeat"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">Game Meat</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="curedMeat"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">Cured Meat</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sweets"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">Sweets</FormLabel>
              </FormItem>
            )}
          />
          {/* Add additional checkboxes for roastedVegetables, softCheese, etc. following the same pattern */}
        </div>

        {/* Other fields (composition, closure, etc.) can be added similarly */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="composition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Composition</FormLabel>
                <FormControl>
                  <Input placeholder="Composition" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="closure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Closure</FormLabel>
                <FormControl>
                  <Input placeholder="Closure" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bottleVolume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bottle Volume</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Bottle Volume"
                    value={field.value ?? ""}
                    // onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    onChange={(e) => {
                      // If the input is empty, you might want to set it to an empty string or a default number.
                      // Here, we'll convert the value to a float, or set it to empty if the input is empty.
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? "" : Number.parseFloat(value)
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alcohol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alcohol</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Alcohol"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      // If the input is empty, you might want to set it to an empty string or a default number.
                      // Here, we'll convert the value to a float, or set it to empty if the input is empty.
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? "" : Number.parseFloat(value)
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
