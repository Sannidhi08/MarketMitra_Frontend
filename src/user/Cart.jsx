import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  IconButton,
  Stack,
  TextField,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3003/orders";
const steps = ["Cart", "Address", "Payment", "Summary", "Confirmation"];

const green = "#2e7d32";
const greenHover = "#256628";

/* Card Style */
const paperStyle = {
  p: 3,
  borderRadius: "18px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  background: "linear-gradient(145deg,#ffffff,#edf7ed)",
};

/* Main Button Style */
const primaryBtn = {
  borderRadius: "10px",
  px: 4,
  py: 1.2,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "15px",
  bgcolor: green,
  "&:hover": { bgcolor: greenHover },
};

const Cart = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardDetails, setCardDetails] = useState({ cardNumber: "", expiry: "", cvv: "" });
  const [upiDetails, setUpiDetails] = useState({ app: "", upiId: "" });
  const [netBankDetails, setNetBankDetails] = useState({ bank: "", userId: "", password: "" });

  const UPI_APPS = ["Google Pay", "PhonePe", "Paytm", "BHIM"];
  const BANKS = ["SBI", "HDFC", "ICICI", "Axis", "Kotak"];

  useEffect(() => {
    if (!userId) return;
    const stored = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
    setCart(stored);
  }, [userId]);

  const updateCart = (updated) => {
    setCart(updated);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updated));
  };

  const increaseQty = (id) =>
    updateCart(cart.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)));

  const decreaseQty = (id) =>
    updateCart(
      cart
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0)
    );

  const removeItem = (id) => updateCart(cart.filter((item) => item.id !== id));

  const grandTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleNext = () => {
    if (activeStep === 0 && cart.length === 0) return alert("Your cart is empty!");

    if (activeStep === 1) {
      for (let key in address) {
        if (!address[key]) return alert("Please fill all address fields");
      }
    }

    if (activeStep === 2 && paymentMethod !== "cod") {
      if (paymentMethod === "card") {
        if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv)
          return alert("Please fill all card details");
      } else if (paymentMethod === "upi") {
        if (!upiDetails.app || !upiDetails.upiId)
          return alert("Please select UPI app and enter UPI ID");
      } else if (paymentMethod === "netbanking") {
        if (!netBankDetails.bank || !netBankDetails.userId || !netBankDetails.password)
          return alert("Please fill all netbanking details");
      }
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handlePlaceOrder = async () => {
    if (!cart.length) return alert("Cart is empty!");

    try {
      const farmers = [...new Set(cart.map((item) => item.farmer_id))].filter((f) => f);
      if (!farmers.length) return alert("Cart items are missing farmer information!");

      for (let farmer_id of farmers) {
        const itemsForFarmer = cart
          .filter((item) => item.farmer_id === farmer_id)
          .map(({ id, price, qty, product_name }) => ({ id, price, qty, product_name }));

        const total_amount = itemsForFarmer.reduce((sum, i) => sum + i.price * i.qty, 0);

        await axios.post(`${API}/add`, {
          user_id: userId,
          farmer_id,
          items: itemsForFarmer,
          total_amount,
          address,
          paymentMethod,
        });
      }

      updateCart([]);
      setActiveStep((prev) => prev + 1);
    } catch (err) {
      console.error("Order failed:", err.response?.data || err.message);
      alert("Order placement failed. Please try again.");
    }
  };

  /* Payment Fields */
  const renderPaymentFields = () => {
    switch (paymentMethod) {
      case "card":
        return (
          <Stack spacing={2} mt={2}>
            <TextField label="Card Number" value={cardDetails.cardNumber}
              onChange={(e)=>setCardDetails({...cardDetails,cardNumber:e.target.value})}/>
            <TextField label="Expiry (MM/YY)" value={cardDetails.expiry}
              onChange={(e)=>setCardDetails({...cardDetails,expiry:e.target.value})}/>
            <TextField label="CVV" type="password" value={cardDetails.cvv}
              onChange={(e)=>setCardDetails({...cardDetails,cvv:e.target.value})}/>
          </Stack>
        );

      case "upi":
        return (
          <Stack spacing={2} mt={2}>
            <FormControl fullWidth>
              <InputLabel>UPI App</InputLabel>
              <Select value={upiDetails.app} label="UPI App"
                onChange={(e)=>setUpiDetails({...upiDetails,app:e.target.value})}>
                {UPI_APPS.map((app)=>(<MenuItem key={app} value={app}>{app}</MenuItem>))}
              </Select>
            </FormControl>
            <TextField label="UPI ID" value={upiDetails.upiId}
              onChange={(e)=>setUpiDetails({...upiDetails,upiId:e.target.value})}/>
          </Stack>
        );

      case "netbanking":
        return (
          <Stack spacing={2} mt={2}>
            <FormControl fullWidth>
              <InputLabel>Bank</InputLabel>
              <Select value={netBankDetails.bank} label="Bank"
                onChange={(e)=>setNetBankDetails({...netBankDetails,bank:e.target.value})}>
                {BANKS.map((b)=>(<MenuItem key={b} value={b}>{b}</MenuItem>))}
              </Select>
            </FormControl>
            <TextField label="User ID" value={netBankDetails.userId}
              onChange={(e)=>setNetBankDetails({...netBankDetails,userId:e.target.value})}/>
            <TextField label="Password" type="password"
              value={netBankDetails.password}
              onChange={(e)=>setNetBankDetails({...netBankDetails,password:e.target.value})}/>
          </Stack>
        );

      default:
        return null;
    }
  };

  /* Steps */
  const renderStepContent = () => {
    switch (activeStep) {

      case 0:
        return (
          <Paper sx={paperStyle}>
            {cart.map((item) => (
              <Box key={item.id} sx={{ mb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box flex={1}>
                    <Typography fontWeight="700">{item.product_name}</Typography>
                    <Typography color="text.secondary">₹{item.price} × {item.qty}</Typography>
                    <Typography fontWeight="bold" sx={{color:green}}>₹{item.price * item.qty}</Typography>

                    <Stack direction="row" spacing={1} mt={1} alignItems="center">
                      <IconButton size="small" onClick={()=>decreaseQty(item.id)} sx={{bgcolor:"#e8f5e9"}}>
                        <Remove/>
                      </IconButton>

                      <Typography fontWeight={600}>{item.qty}</Typography>

                      <IconButton size="small" onClick={()=>increaseQty(item.id)} sx={{bgcolor:"#e8f5e9"}}>
                        <Add/>
                      </IconButton>
                    </Stack>
                  </Box>

                  <IconButton color="error" onClick={()=>removeItem(item.id)}>
                    <Delete/>
                  </IconButton>
                </Stack>
                <Divider sx={{ mt: 2 }}/>
              </Box>
            ))}

            <Typography variant="h6" mt={2}>Total: ₹{grandTotal}</Typography>

            <Button variant="outlined"
              sx={{ mt:2,borderRadius:"10px",borderColor:green,color:green }}
              onClick={()=>navigate("/products")}>
              Continue Shopping
            </Button>
          </Paper>
        );

      case 1:
        return (
          <Paper sx={paperStyle}>
            <Stack spacing={2}>
              {["name","phone","street","city","state","pincode"].map((field)=>(
                <TextField key={field}
                  label={field.charAt(0).toUpperCase()+field.slice(1)}
                  value={address[field]}
                  onChange={(e)=>setAddress({...address,[field]:e.target.value})}/>
              ))}
            </Stack>
          </Paper>
        );

      case 2:
        return (
          <Paper sx={paperStyle}>
            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select value={paymentMethod} label="Payment Method"
                onChange={(e)=>setPaymentMethod(e.target.value)}>
                <MenuItem value="cod">Cash on Delivery</MenuItem>
                <MenuItem value="card">Credit/Debit Card</MenuItem>
                <MenuItem value="upi">UPI / Wallet</MenuItem>
                <MenuItem value="netbanking">Netbanking</MenuItem>
              </Select>
            </FormControl>
            {paymentMethod !== "cod" && renderPaymentFields()}
          </Paper>
        );

      case 3:
        return (
          <Paper sx={paperStyle}>
            <Typography variant="h6" fontWeight={700}>Order Summary</Typography>

            {cart.map((item)=>(
              <Stack key={item.id} direction="row" justifyContent="space-between">
                <Typography>{item.product_name} x {item.qty}</Typography>
                <Typography>₹{item.price * item.qty}</Typography>
              </Stack>
            ))}

            <Divider sx={{ my:2 }}/>

            <Typography variant="h6">Total: ₹{grandTotal}</Typography>
            <Typography mt={1}>
              Shipping to: {address.name}, {address.street}, {address.city}, {address.state} - {address.pincode}
            </Typography>

            <Typography mt={1}>Payment Method: {paymentMethod.toUpperCase()}</Typography>
          </Paper>
        );

      case 4:
        return (
          <Paper sx={{...paperStyle,textAlign:"center"}}>
            <Typography variant="h4" sx={{color:green,fontWeight:800}}>
              🎉 Order Placed Successfully!
            </Typography>

            <Button variant="contained" sx={{...primaryBtn,mt:3}}
              onClick={()=>navigate("/user/orders")}>
              Go to My Orders
            </Button>
          </Paper>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p:4, maxWidth:900, mx:"auto" }}>
      <Typography variant="h4" gutterBottom fontWeight={800} sx={{color:green}}>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb:4 }}>
        {steps.map((label)=>(
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent()}

      <Stack direction="row" spacing={2} mt={4}>
        <Button disabled={activeStep===0} onClick={handleBack} sx={{borderRadius:"10px"}}>
          Back
        </Button>

        {activeStep===3 && (
          <Button variant="contained" sx={primaryBtn} onClick={handlePlaceOrder}>
            Place Order
          </Button>
        )}

        {activeStep<3 && (
          <Button variant="contained" sx={primaryBtn} onClick={handleNext}>
            Next
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default Cart;