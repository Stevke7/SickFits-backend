import "dotenv/config";
import { createSchema, config } from "@keystone-next/keystone/schema";
import { createAuth } from "@keystone-next/auth";
import { password } from "@keystone-next/fields";
import {
	withItemData,
	statelessSessions,
} from "@keystone-next/keystone/session";
import { User } from "./schemas/User";
import { Product } from "./schemas/Product";
import { ProductImage } from "./schemas/ProductImage";
import { insertSeedData } from "./seed-data";
import { sendPasswordResetEmail } from "./lib/mail";

const databaseUrl = process.env.DATABASE_URL;

const sessionConfig = {
	maxAge: 60 * 60 * 24 * 30,
	secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
	listKey: "User",
	identityField: "email",
	secretField: "password",
	initFirstItem: {
		fields: ["name", "email", "password"],
		// TODO Initial roles here
	},

	passwordResetLink: {
		async sendToken(args) {
			await sendPasswordResetEmail(args.token, args.identity);
		},
	},
});

export default withAuth(
	config({
		// @ts-ignore
		server: {
			cors: {
				origin: [process.env.FRONTEND_URL],
				credentials: true,
			},
		},
		db: {
			adapter: "mongoose",
			url: databaseUrl,
			async onConnect(keystone) {
				console.log("Connected to the database!");
				if (process.argv.includes("--seed-data")) {
					await insertSeedData(keystone);
				}
			},
		},
		lists: createSchema({
			// Schema items goes here
			User,
			Product,
			ProductImage,
		}),
		ui: {
			// Show UI to authenticated users
			isAccessAllowed: ({ session }) => !!session?.data,
			// TODO: change this for roles
		},
		session: withItemData(statelessSessions(sessionConfig), {
			User: "id",
		}),
	})
);
