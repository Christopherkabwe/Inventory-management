import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES = "7d";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, password, stackUser } = req.body;

    try {
        let user;

        // -------------------- STACKAUTH LOGIN --------------------
        if (stackUser) {
            user = await prisma.user.findUnique({
                where: { stackAuthId: stackUser.id },
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        stackAuthId: stackUser.id,
                        email: stackUser.primaryEmail,
                        fullName: stackUser.displayName ?? stackUser.primaryEmail.split("@")[0],
                        role: "USER",
                        isActive: true,
                    },
                });
            }
        }

        // -------------------- LOCAL EMAIL/PASSWORD LOGIN --------------------
        else if (email && password) {
            user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return res.status(401).json({ error: "User not found" });
            }
            if (!user.password) {
                return res.status(401).json({ error: "User does not have a password set" });
            }

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                return res.status(401).json({ error: "Invalid password" });
            }
        }

        // -------------------- INVALID REQUEST --------------------
        else {
            return res.status(400).json({ error: "Invalid request body" });
        }

        // -------------------- CHECK IF USER IS ACTIVE --------------------
        if (!user.isActive) {
            return res.status(403).json({ error: "User is inactive" });
        }

        // -------------------- CREATE JWT --------------------
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}
