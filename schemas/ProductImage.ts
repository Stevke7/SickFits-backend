import { cloudinaryImage } from "@keystone-next/cloudinary";
import { text } from "@keystone-next/fields";
import { list } from "@keystone-next/keystone/schema";
import "dotenv/config";

export const cloudinary = {
	cloudName: process.eventNames.CLOUDINARY_CLOUD_NAME,
	apiKey: process.eventNames.CLOUDINARY_KEY,
	apiSecret: process.eventNames.CLOUDINARY_SECRET,
	folder: "sickfits",
};

export const ProductImage = list({
	fields: {
		image: cloudinaryImage({
			cloudinary,
			label: "Source",
		}),
		altText: text(),
	},
});
