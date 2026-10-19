"""
Dataset Generator for Product Return Prediction.
Creates a realistic e-commerce return dataset with mathematically sound,
realistic relationships between customer/order/product features and return probability.
"""

import os
import numpy as np
import pandas as pd

def generate_ecommerce_dataset(num_records: int = 3500, random_seed: int = 42) -> pd.DataFrame:
    np.random.seed(random_seed)
    
    order_ids = [f"ORD-{10000 + i}" for i in range(num_records)]
    
    # Customer demographics
    ages = np.random.choice(
        np.arange(18, 72),
        size=num_records,
        p=np.exp(-0.5 * ((np.arange(18, 72) - 34) / 12) ** 2) / np.sum(np.exp(-0.5 * ((np.arange(18, 72) - 34) / 12) ** 2))
    )
    genders = np.random.choice(["Female", "Male", "Other"], size=num_records, p=[0.52, 0.44, 0.04])
    regions = np.random.choice(["North", "South", "East", "West", "Central"], size=num_records, p=[0.28, 0.24, 0.18, 0.20, 0.10])
    
    # Previous order history
    # 25% first order
    is_first_order_flags = np.random.choice([1, 0], size=num_records, p=[0.25, 0.75])
    previous_orders = []
    previous_returns = []
    for is_first in is_first_order_flags:
        if is_first == 1:
            previous_orders.append(0)
            previous_returns.append(0)
        else:
            orders = int(np.random.geometric(p=0.15))
            orders = min(orders, 25)
            # return rate varies by customer type: typical customer returns 10-25%
            ret_rate = np.random.beta(a=1.8, b=7.0)
            returns = np.random.binomial(n=orders, p=ret_rate)
            previous_orders.append(orders)
            previous_returns.append(returns)
            
    previous_orders = np.array(previous_orders)
    previous_returns = np.array(previous_returns)
    is_first_order = ["Yes" if f == 1 else "No" for f in is_first_order_flags]
    
    # Product categories
    categories = np.random.choice(
        ["Apparel", "Footwear", "Electronics", "Home & Kitchen", "Beauty & Personal Care", "Books"],
        size=num_records,
        p=[0.30, 0.20, 0.18, 0.14, 0.10, 0.08]
    )
    
    # Pricing conditioned on category
    prices = []
    for cat in categories:
        if cat == "Electronics":
            p = np.random.gamma(shape=4.0, scale=80.0) # ~$320
        elif cat == "Footwear":
            p = np.random.gamma(shape=3.5, scale=25.0) # ~$85
        elif cat == "Apparel":
            p = np.random.gamma(shape=3.0, scale=20.0) # ~$60
        elif cat == "Home & Kitchen":
            p = np.random.gamma(shape=3.0, scale=35.0) # ~$105
        elif cat == "Beauty & Personal Care":
            p = np.random.gamma(shape=2.5, scale=15.0) # ~$38
        else: # Books
            p = np.random.gamma(shape=2.5, scale=10.0) # ~$25
        prices.append(round(max(12.0, min(1400.0, p)), 2))
    prices = np.array(prices)
    
    # Discount percentage
    discounts = np.random.choice([0, 5, 10, 15, 20, 25, 30, 40, 50, 60], size=num_records, p=[0.15, 0.12, 0.18, 0.15, 0.14, 0.09, 0.08, 0.05, 0.03, 0.01])
    
    # Quantity
    quantities = np.random.choice([1, 2, 3, 4, 5], size=num_records, p=[0.68, 0.20, 0.07, 0.03, 0.02])
    
    # Ratings
    product_ratings = np.clip(np.round(np.random.normal(loc=3.9, scale=0.8, size=num_records), 1), 1.2, 5.0)
    customer_ratings = np.clip(np.round(np.random.normal(loc=4.1, scale=0.7, size=num_records), 1), 1.0, 5.0)
    
    # Shipping & Delivery
    shipping_methods = np.random.choice(["Standard", "Express", "Same Day", "Economy"], size=num_records, p=[0.55, 0.25, 0.08, 0.12])
    
    expected_deliveries = []
    actual_deliveries = []
    for sm in shipping_methods:
        if sm == "Same Day":
            exp = 1
            act = np.random.choice([1, 2, 3], p=[0.82, 0.14, 0.04])
        elif sm == "Express":
            exp = np.random.choice([2, 3], p=[0.6, 0.4])
            act = exp + np.random.choice([0, 1, 2, 3], p=[0.72, 0.18, 0.07, 0.03])
        elif sm == "Economy":
            exp = np.random.choice([6, 7, 8], p=[0.4, 0.4, 0.2])
            act = exp + np.random.choice([-1, 0, 1, 2, 3, 4], p=[0.10, 0.55, 0.18, 0.10, 0.05, 0.02])
        else: # Standard
            exp = np.random.choice([4, 5], p=[0.5, 0.5])
            act = exp + np.random.choice([-1, 0, 1, 2, 3], p=[0.12, 0.65, 0.14, 0.06, 0.03])
        expected_deliveries.append(int(exp))
        actual_deliveries.append(int(max(1, act)))
        
    expected_deliveries = np.array(expected_deliveries)
    actual_deliveries = np.array(actual_deliveries)
    
    # Payment Method
    payment_methods = np.random.choice(
        ["Credit Card", "Debit Card", "UPI", "Cash on Delivery"],
        size=num_records,
        p=[0.32, 0.22, 0.31, 0.15]
    )
    
    # Latent probability model for Return_Status
    # z = log-odds of return
    # Base intercept
    z = -1.55
    
    # Category effects
    category_weights = {
        "Apparel": 0.70,                # High sizing uncertainty
        "Footwear": 0.60,               # High fit/comfort uncertainty
        "Electronics": -0.40,           # High specification clarity
        "Home & Kitchen": 0.05,
        "Beauty & Personal Care": -0.25,
        "Books": -0.75                  # Rarely returned
    }
    z_cat = np.array([category_weights[c] for c in categories])
    
    # Delivery delay effect: Delivery_Time - Expected_Delivery_Time
    delay = actual_deliveries - expected_deliveries
    z_delay = 0.42 * delay
    
    # Customer previous return behavior
    customer_return_ratio = previous_returns / (previous_orders + 1.0)
    z_history = 2.40 * customer_return_ratio
    
    # Product quality effect
    z_prod_rating = -0.55 * (product_ratings - 3.8)
    
    # Customer satisfaction effect
    z_cust_rating = -0.30 * (customer_ratings - 4.0)
    
    # Payment method effect: Cash on Delivery has higher refusal/return
    payment_weights = {
        "Cash on Delivery": 0.48,
        "Debit Card": 0.05,
        "Credit Card": -0.15,
        "UPI": -0.20
    }
    z_payment = np.array([payment_weights[p] for p in payment_methods])
    
    # First order with delay interaction
    z_first_delay = 0.30 * (is_first_order_flags * (delay > 0).astype(int))
    
    # Discount effect (mild impulse buying)
    z_discount = 0.010 * (discounts - 15)
    
    # Price effect for clothing/footwear (expensive apparel gets returned more if fit is slightly off)
    is_fashion = np.isin(categories, ["Apparel", "Footwear"]).astype(int)
    z_price = 0.0015 * (prices - 75) * is_fashion
    
    # Random realistic noise
    noise = np.random.normal(loc=0.0, scale=0.55, size=num_records)
    
    total_z = z + z_cat + z_delay + z_history + z_prod_rating + z_cust_rating + z_payment + z_first_delay + z_discount + z_price + noise
    
    # Logistic sigmoid
    probabilities = 1.0 / (1.0 + np.exp(-total_z))
    
    # Bernoulli trial
    return_status = (np.random.rand(num_records) < probabilities).astype(int)
    
    df = pd.DataFrame({
        "Order_ID": order_ids,
        "Customer_Age": ages,
        "Customer_Gender": genders,
        "Product_Category": categories,
        "Product_Price": prices,
        "Discount_Percentage": discounts,
        "Quantity": quantities,
        "Previous_Orders": previous_orders,
        "Previous_Returns": previous_returns,
        "Customer_Rating": customer_ratings,
        "Delivery_Time": actual_deliveries,
        "Expected_Delivery_Time": expected_deliveries,
        "Payment_Method": payment_methods,
        "Shipping_Method": shipping_methods,
        "Customer_Location": regions,
        "Product_Rating": product_ratings,
        "Is_First_Order": is_first_order,
        "Return_Status": return_status
    })
    
    # Introduce small realistic missing values (~1-2%) to demonstrate real imputation
    missing_indices_cr = np.random.choice(num_records, size=int(num_records * 0.02), replace=False)
    df.loc[missing_indices_cr, "Customer_Rating"] = np.nan
    
    missing_indices_dt = np.random.choice(num_records, size=int(num_records * 0.012), replace=False)
    df.loc[missing_indices_dt, "Delivery_Time"] = np.nan
    
    missing_indices_gen = np.random.choice(num_records, size=int(num_records * 0.015), replace=False)
    df.loc[missing_indices_gen, "Customer_Gender"] = np.nan
    
    # Introduce ~15 duplicate rows to demonstrate duplicate detection & removal
    duplicate_rows = df.iloc[:15].copy()
    df = pd.concat([df, duplicate_rows], ignore_index=True)
    
    return df

def save_default_dataset(output_path: str = "backend/data/product_returns.csv"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df = generate_ecommerce_dataset(num_records=3500, random_seed=42)
    df.to_csv(output_path, index=False)
    print(f"Dataset generated with {len(df)} rows and saved to {output_path}")
    print(f"Class distribution: {df['Return_Status'].value_counts(normalize=True).to_dict()}")

if __name__ == "__main__":
    save_default_dataset()
