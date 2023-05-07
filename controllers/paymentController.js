const asyncHandler = require("express-async-handler");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const validateMongodbId = require("../utils/validateMongodbId");

//create checkout session
const createCheckoutSession = asyncHandler(async (req, res) => {
  const { cartItems } = req.body;
  // console.log(cartItems);

  const line_items = cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productId.title,
          images: [
            item.productId.images[0].url || "https://i.imgur.com/7I6Wasd.png",
          ],
          metadata: {
            id: item.productId._id.toString(),
            color: item.color.title,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GB", "FR", "DE", "IN"],
    },
    phone_number_collection: {
      enabled: true,
    },
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/order/success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  res.send({ url: session.url });
});

module.exports = {
  createCheckoutSession,
};
