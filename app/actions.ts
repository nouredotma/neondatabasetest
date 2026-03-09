"use server";

import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export async function subscribeEmail(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;
    
    const resumeFile = formData.get("resume") as File;
    const profileImageFile = formData.get("profileImage") as File;

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !message) {
      return { success: false, error: "All fields are required." };
    }

    if (!email.includes("@")) {
      return { success: false, error: "Please enter a valid email address." };
    }

    let resumePath = "";
    let profileImagePath = "";

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Handle Resume Upload
    if (resumeFile && resumeFile.size > 0) {
      if (resumeFile.size > 5 * 1024 * 1024) {
        return { success: false, error: "Resume must be less than 5MB." };
      }
      const resumeExt = resumeFile.name.split(".").pop();
      if (!["pdf", "docx"].includes(resumeExt?.toLowerCase() || "")) {
        return { success: false, error: "Resume must be a PDF or DOCX file." };
      }
      
      const resumeName = `resume-${randomUUID()}.${resumeExt}`;
      const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer());
      await writeFile(join(uploadsDir, resumeName), resumeBuffer);
      resumePath = `/uploads/${resumeName}`;
    }

    // Handle Profile Image Upload
    if (profileImageFile && profileImageFile.size > 0) {
      if (profileImageFile.size > 5 * 1024 * 1024) {
        return { success: false, error: "Profile image must be less than 5MB." };
      }
      const imageExt = profileImageFile.name.split(".").pop();
      if (!["jpg", "jpeg", "png", "webp"].includes(imageExt?.toLowerCase() || "")) {
        return { success: false, error: "Profile image must be an image file (jpg, png, webp)." };
      }

      const imageName = `profile-${randomUUID()}.${imageExt}`;
      const imageBuffer = Buffer.from(await profileImageFile.arrayBuffer());
      await writeFile(join(uploadsDir, imageName), imageBuffer);
      profileImagePath = `/uploads/${imageName}`;
    }

    await prisma.subscriber.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        message,
        resume: resumePath,
        profileImage: profileImagePath,
      },
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Submission error:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return { success: false, error: "This email is already registered." };
    }
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
