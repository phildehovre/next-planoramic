import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateUserResult {
  data?: any;
  isLoading: boolean;
  error?: Error;
}

export async function createUser(userData: any): Promise<CreateUserResult> {
  let isLoading = true;
  let error: any = null;
  let user: any = null;

  try {
    // Check if the user already exists based on email
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      // User already exists, handle accordingly (throw an error, return, etc.)
      throw new Error("User with this email already exists");
    }

    // If the user doesn't exist, create a new user
    const createdUser = await prisma.user.create({
      data: {
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.emailAddress,
        clerk_id: userData.id,
      },
    });

    user = createdUser;
  } catch (err: unknown) {
    error = err;
  } finally {
    isLoading = false;
  }

  return { data: user, isLoading, error };
}
