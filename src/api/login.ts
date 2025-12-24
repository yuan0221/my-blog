import { UmiApiRequest, UmiApiResponse } from "umi";
import bcrypt from "bcryptjs";
import { signToken } from "@/utils/jwt";
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  switch (req.method) {
    case 'POST':
      try {
        const prisma = new PrismaClient({ adapter });
        const user = await prisma.user.findUnique({
          where: { email: req.body.email }
        });
        if (!user || !bcrypt.compareSync(req.body.password, user.passwordHash)) {
          return res.status(401).json({
            message: 'Invalid email or password'
          });
        }
        res.status(200)
          .setCookie('token', await signToken(user.id))
          .json({ ...user, passwordHash: undefined });
        await prisma.$disconnect()
      } catch (error: any) {
        res.status(500).json(error);
      }
      break;
    default:
      res.status(405).json({ error: 'Method not allowed' })
  }
}
