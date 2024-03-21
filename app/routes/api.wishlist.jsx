import { json } from "@remix-run/node"

export async function loader() {
    return json({
        ok: true,
        message: "hello from api"
    })
}

export async function action({ request }) {
    const method = request.method
    switch (method) {
        case "POST":
            return json({ message: "Success", method: "POST" });
            break;
        case "PATCH":
            return json({ message: "Success", method: "PATCH" });
            break;
        default:
            return new Response("Method Not Allowed", { status: 405 })
    }
    // return json({ message: "Success" })
}
