import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'react-toastify'; // Sadece toast import edildi, ToastContainer kaldırıldı
import 'react-toastify/dist/ReactToastify.css';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAddBlogMutation } from '@/redux/slice/blogApiSlice';

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
  category: z.string().min(2, 'Category must be at least 2 characters.'),
  tags: z.string().refine(
    (val) => {
      const tags = val.split(',').map((tag) => tag.trim());
      return tags.length >= 1;
    },
    { message: 'Please add at least one tag.' }
  ),
  isPublished: z.boolean(),
});

const BlogAdd2: React.FC = () => {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
      tags: '',
      isPublished: false,
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = methods;

  const [addBlog, { isLoading }] = useAddBlogMutation();

  const onSubmit = async (data: any) => {
    try {
      data.tags = data.tags.split(',').map((tag: string) => tag.trim());

      await addBlog(data).unwrap();
      console.log('Blog added successfully');

      toast.success('Blog added successfully!', {
        position: 'top-right',
        autoClose: 1000,
        onClose: () => {
          window.location.reload();
        },
      });

      reset();
    } catch (error) {
      console.error('Failed to add blog:', error);
      toast.error('Failed to add blog. Please try again later.');
    }
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter blog title"
                    {...field}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </FormControl>
                <FormDescription>
                  Enter the title of your blog post.
                </FormDescription>
                <FormMessage>
                  {errors.title?.message && <p>{errors.title.message}</p>}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <textarea
                    className="block w-full h-48 resize-none border-gray-300 rounded-md shadow-sm p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Enter the content of your blog post."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter the content of your blog post.
                </FormDescription>
                <FormMessage>
                  {errors.content?.message && <p>{errors.content.message}</p>}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter blog category"
                    {...field}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </FormControl>
                <FormDescription>
                  Enter the category of your blog post.
                </FormDescription>
                <FormMessage>
                  {errors.category?.message && <p>{errors.category.message}</p>}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Add tags, separated by commas"
                    {...field}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </FormControl>
                <FormDescription>
                  Enter tags for your blog post, separated by commas.
                </FormDescription>
                <FormMessage>
                  {errors.tags?.message && <p>{errors.tags.message}</p>}
                </FormMessage>
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <label htmlFor="isPublished" className="text-sm text-gray-600">
              Publish
            </label>
            <input
              type="checkbox"
              {...methods.register('isPublished')}
              id="isPublished"
              className="transform scale-150 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            Submit
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default BlogAdd2;
