import { prisma } from "./prisma";

export async function touchLastActive(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { lastActiveAt: new Date() },
  });
}
