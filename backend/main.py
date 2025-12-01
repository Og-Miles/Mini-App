from fastapi import FastAPI, Request
import requests, os, time

app = FastAPI()

NOWPAYMENTS_API_KEY = os.getenv("NOWPAYMENTS_API_KEY")
FLUTTERWAVE_SECRET_KEY = os.getenv("FLUTTERWAVE_SECRET_KEY")

@app.post("/pay/crypto")
async def pay_crypto(payload: dict):
    usd_price = payload.get("usd")
    plan = payload.get("plan")
    headers = {"x-api-key": NOWPAYMENTS_API_KEY}
    data = {
        "price_amount": usd_price,
        "price_currency": "usd",
        "order_id": f"sub_{plan}_{int(time.time())}",
        "order_description": f"{plan} subscription"
    }
    r = requests.post("https://api.nowpayments.io/v1/invoice", json=data, headers=headers)
    return {"url": r.json()["invoice_url"]}

@app.post("/pay/card")
async def pay_card(payload: dict):
    ngn_price = payload.get("ngn")
    plan = payload.get("plan")
    headers = {"Authorization": f"Bearer {FLUTTERWAVE_SECRET_KEY}"}
    data = {
        "tx_ref": f"sub_{plan}_{int(time.time())}",
        "amount": ngn_price,
        "currency": "NGN",
        "redirect_url": "https://your-frontend.vercel.app/success",
        "customer": {"email": "user@example.com"},
        "payment_options": "card,banktransfer,ussd"
    }
    r = requests.post("https://api.flutterwave.com/v3/payments", json=data, headers=headers)
    return {"url": r.json()["data"]["link"]}
