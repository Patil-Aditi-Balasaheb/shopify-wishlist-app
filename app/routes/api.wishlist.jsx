import { json } from "@remix-run/node"
import db from "../db.server"
import { cors } from "remix-utils/cors"

// get request: accepts: customerId, shop, productId
// read wishlist items for a customer from database
export async function loader({ request }) {
    const url = new URL(request.url)
    const customerId = url.searchParams.get("customerId")
    const shop = url.searchParams.get("shop")
    const productId = url.searchParams.get("productId")

    if (!customerId || !shop || !productId) {
        return json({
            message: "Missing fields. Required fields: customerId, productId, shop",
            method: "GET"
        })
    }

    // if everything is provided, return wishlist items of customer
    const wishlist = await db.wishlist.findMany({
        where: {
            customerId: customerId,
            shop: shop,
            productId: productId
        }
    })

    const response = json({
        ok: true,
        message: "Success",
        data: wishlist
    })

    return cors(request, response);
}

// post request: accepts: customerId, shop, productId, _action
// can be used to create or delete wishlist item from database
export async function action({ request }) {

    let data = await request.formData()
    data = Object.fromEntries(data)
    const customerId = data.customerId
    const productId = data.productId
    const shop = data.shop
    const _action = data._action

    if (!customerId || !productId || !shop || !_action) {
        return json({
            message: "Missing data. Required data: customerId, productId, shop, _action",
            method: _action
        })
    }

    let response

    switch (_action) {
        case "CREATE":
            // add new item to wishlist
            const wishlist = await db.wishlist.create({
                data: {
                    customerId,
                    productId,
                    shop
                }
            })

            response = json({ message: "Product added to wishlist", method: "POST", wishlisted: true })
            return cors(request, response);

        case "PATCH":
            // update an existing item in wishlist
            return json({ message: "Success", method: "PATCH" });

        case "DELETE":
            // remove an item from wishlist
            await db.wishlist.deleteMany({
                where: {
                    customerId: customerId,
                    shop: shop,
                    productId: productId
                }
            })

            response = json({ message: "Product removed from your wishlist", method: _action, wishlisted: false });
            return cors(request, response);

        default:
            return new Response("Method Not Allowed", { status: 405 })
    }
}
