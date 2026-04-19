import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetProfile, useUpdateProfile, useRequestUploadUrl, getGetProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Upload, File as FileIcon, X, User } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  tagline: z.string().min(1, "Tagline is required"),
  aboutText: z.string().min(1, "About text is required"),
  profilePhotoPath: z.string().nullable().optional(),
  cvPath: z.string().nullable().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const { data: profile, isLoading } = useGetProfile();
  const updateProfile = useUpdateProfile();
  const requestUploadUrl = useRequestUploadUrl();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      title: "",
      tagline: "",
      aboutText: "",
      profilePhotoPath: null,
      cvPath: null,
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        title: profile.title || "",
        tagline: profile.tagline || "",
        aboutText: profile.aboutText || "",
        profilePhotoPath: profile.profilePhotoPath,
        cvPath: profile.cvPath,
      });
    }
  }, [profile, form]);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "photo" | "cv"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "photo") setIsUploadingPhoto(true);
    else setIsUploadingCv(true);

    try {
      // 1. Get upload URL
      const { uploadURL, objectPath } = await requestUploadUrl.mutateAsync({
        data: {
          name: file.name,
          size: file.size,
          contentType: file.type,
        }
      });

      // 2. PUT file
      const res = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to upload file");
      }

      // 3. Update form and auto-save
      if (type === "photo") {
        form.setValue("profilePhotoPath", objectPath);
        await updateProfile.mutateAsync({
          data: { profilePhotoPath: objectPath }
        });
      } else {
        form.setValue("cvPath", objectPath);
        await updateProfile.mutateAsync({
          data: { cvPath: objectPath }
        });
      }

      queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
      toast({
        title: "Upload complete",
        description: `${type === "photo" ? "Profile photo" : "CV"} has been uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file.",
        variant: "destructive",
      });
    } finally {
      if (type === "photo") setIsUploadingPhoto(false);
      else setIsUploadingCv(false);
      // Reset input
      if (e.target) e.target.value = "";
    }
  };

  const removeFile = async (type: "photo" | "cv") => {
    try {
      if (type === "photo") {
        form.setValue("profilePhotoPath", null);
        await updateProfile.mutateAsync({
          data: { profilePhotoPath: null }
        });
      } else {
        form.setValue("cvPath", null);
        await updateProfile.mutateAsync({
          data: { cvPath: null }
        });
      }
      queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
      toast({
        title: "File removed",
        description: `${type === "photo" ? "Profile photo" : "CV"} has been removed.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove file.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile.mutate(
      { data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
          toast({
            title: "Profile updated",
            description: "Your profile information has been saved.",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update profile.",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPhotoPath = form.watch("profilePhotoPath");
  const currentCvPath = form.watch("cvPath");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and assets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    These details will be displayed on the hero section of your portfolio.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Software Engineer" {...field} data-testid="input-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tagline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tagline / Short Intro</FormLabel>
                        <FormControl>
                          <Input placeholder="Building digital experiences" {...field} data-testid="input-tagline" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="aboutText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About Me</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell the world about yourself..." 
                            className="min-h-[150px]" 
                            {...field} 
                            data-testid="textarea-about"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-6">
                  <Button 
                    type="submit" 
                    disabled={updateProfile.isPending}
                    data-testid="button-save-profile"
                  >
                    {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>Upload a professional headshot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="h-32 w-32 rounded-full border-2 border-border overflow-hidden bg-muted flex items-center justify-center relative">
                  {currentPhotoPath ? (
                    <img 
                      src={`/api/storage/objects${currentPhotoPath}`} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-muted-foreground" />
                  )}
                  {isUploadingPhoto && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col w-full gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={photoInputRef}
                    onChange={(e) => handleUpload(e, "photo")}
                  />
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {currentPhotoPath ? "Change Photo" : "Upload Photo"}
                  </Button>
                  {currentPhotoPath && (
                    <Button 
                      variant="ghost" 
                      className="w-full text-destructive hover:text-destructive"
                      onClick={() => removeFile("photo")}
                      disabled={isUploadingPhoto}
                    >
                      Remove Photo
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resume / CV</CardTitle>
              <CardDescription>Upload your latest CV as a PDF</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentCvPath ? (
                  <div className="flex items-center p-3 border rounded-md bg-muted/50">
                    <FileIcon className="h-8 w-8 text-primary mr-3 flex-shrink-0" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">Resume uploaded</p>
                      <p className="text-xs text-muted-foreground truncate">{currentCvPath.split('/').pop()}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive h-8 w-8 ml-2"
                      onClick={() => removeFile("cv")}
                      title="Remove CV"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-6 border-2 border-dashed rounded-md bg-muted/20">
                    <FileIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No CV uploaded</p>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  ref={cvInputRef}
                  onChange={(e) => handleUpload(e, "cv")}
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => cvInputRef.current?.click()}
                  disabled={isUploadingCv}
                >
                  {isUploadingCv ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  {currentCvPath ? "Replace CV" : "Upload CV"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
