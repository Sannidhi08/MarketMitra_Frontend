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
  Chip
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3003/orders";
const steps = ["Cart", "Address", "Payment", "Summary", "Confirmation"];

const green = "#2e7d32";
const greenHover = "#256628";

const paperStyle = {
  p: 3,
  borderRadius: "18px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  background: "linear-gradient(145deg,#ffffff,#edf7ed)"
};

const primaryBtn = {
  borderRadius: "10px",
  px: 4,
  py: 1.2,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "15px",
  bgcolor: green,
  "&:hover": { bgcolor: greenHover }
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
    pincode: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const [upiDetails, setUpiDetails] = useState({
    app: "",
    upiId: ""
  });

  const [netBankDetails, setNetBankDetails] = useState({
    bank: "",
    userId: "",
    password: ""
  });

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
    updateCart(cart.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));

  const decreaseQty = (id) =>
    updateCart(
      cart
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );

  const removeItem = (id) =>
    updateCart(cart.filter((i) => i.id !== id));

  const grandTotal = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const nameRegex = /^[A-Za-z ]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const pinRegex = /^[0-9]{6}$/;
  const cardRegex = /^[0-9]{16}$/;
  const cvvRegex = /^[0-9]{3}$/;
  const upiRegex = /^[\w.-]+@[\w.-]+$/;

  const handleNext = () => {

    if (activeStep === 0 && cart.length === 0)
      return alert("Your cart is empty!");

    if (activeStep === 1) {

      if (!nameRegex.test(address.name))
        return alert("Name must contain only letters");

      if (!phoneRegex.test(address.phone))
        return alert("Phone must be 10 digits");

      if (!pinRegex.test(address.pincode))
        return alert("Pincode must be 6 digits");

      for (let key in address)
        if (!address[key])
          return alert("Please fill all address fields");
    }

    if (activeStep === 2 && paymentMethod !== "cod") {

      if (paymentMethod === "card") {
        if (!cardRegex.test(cardDetails.cardNumber))
          return alert("Card number must be 16 digits");

        if (!cvvRegex.test(cardDetails.cvv))
          return alert("CVV must be 3 digits");

        if (!cardDetails.expiry)
          return alert("Enter card expiry");
      }

      if (paymentMethod === "upi") {
        if (!upiDetails.app)
          return alert("Select UPI App");

        if (!upiRegex.test(upiDetails.upiId))
          return alert("Enter valid UPI ID");
      }

      if (paymentMethod === "netbanking") {
        if (!netBankDetails.bank || !netBankDetails.userId || !netBankDetails.password)
          return alert("Fill all netbanking details");
      }
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () =>
    setActiveStep((prev) => prev - 1);

  const handlePlaceOrder = async () => {

    if (!cart.length)
      return alert("Cart empty");

    try {

      const farmers = [...new Set(cart.map(i => i.farmer_id))];

      for (let farmer_id of farmers) {

        const itemsForFarmer = cart
          .filter(i => i.farmer_id === farmer_id)
          .map(({ id, price, qty, product_name }) => ({
            id,
            price,
            qty,
            product_name
          }));

        const total_amount =
          itemsForFarmer.reduce(
            (sum, i) => sum + i.price * i.qty,
            0
          );

        await axios.post(`${API}/add`, {
          user_id: userId,
          farmer_id,
          items: itemsForFarmer,
          total_amount,
          address,
          paymentMethod
        });
      }

      updateCart([]);
      setActiveStep((prev) => prev + 1);

    } catch (err) {
      console.error(err);
      alert("Order failed");
    }
  };

  const renderPaymentFields = () => {

    if (paymentMethod === "card")
      return (
        <Stack spacing={2} mt={2}>
          <TextField
            label="Card Number"
            required
            inputProps={{ maxLength: 16 }}
            value={cardDetails.cardNumber}
            onChange={(e) =>
              setCardDetails({
                ...cardDetails,
                cardNumber: e.target.value.replace(/\D/g, "")
              })
            }
          />

          <TextField
            label="Expiry"
            type="month"
            required
            value={cardDetails.expiry}
            onChange={(e) =>
              setCardDetails({
                ...cardDetails,
                expiry: e.target.value
              })
            }
          />

          <TextField
            label="CVV"
            required
            inputProps={{ maxLength: 3 }}
            type="password"
            value={cardDetails.cvv}
            onChange={(e) =>
              setCardDetails({
                ...cardDetails,
                cvv: e.target.value.replace(/\D/g, "")
              })
            }
          />
        </Stack>
      );

    if (paymentMethod === "upi")
      return (
        <Stack spacing={2} mt={2}>

          <FormControl fullWidth required>
            <InputLabel>UPI App</InputLabel>
            <Select
              value={upiDetails.app}
              label="UPI App"
              onChange={(e) =>
                setUpiDetails({
                  ...upiDetails,
                  app: e.target.value
                })
              }
            >
              {UPI_APPS.map((a) => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="UPI ID"
            required
            value={upiDetails.upiId}
            onChange={(e) =>
              setUpiDetails({
                ...upiDetails,
                upiId: e.target.value
              })
            }
          />

        </Stack>
      );

    if (paymentMethod === "netbanking")
      return (
        <Stack spacing={2} mt={2}>

          <FormControl fullWidth required>
            <InputLabel>Bank</InputLabel>
            <Select
              value={netBankDetails.bank}
              label="Bank"
              onChange={(e) =>
                setNetBankDetails({
                  ...netBankDetails,
                  bank: e.target.value
                })
              }
            >
              {BANKS.map((b) => (
                <MenuItem key={b} value={b}>{b}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="User ID"
            required
            value={netBankDetails.userId}
            onChange={(e) =>
              setNetBankDetails({
                ...netBankDetails,
                userId: e.target.value
              })
            }
          />

          <TextField
            label="Password"
            type="password"
            required
            value={netBankDetails.password}
            onChange={(e) =>
              setNetBankDetails({
                ...netBankDetails,
                password: e.target.value
              })
            }
          />

        </Stack>
      );

    return null;
  };

  const renderCart = () => (

    <Paper sx={paperStyle}>

      {cart.map((item) => (

        <Box key={item.id} sx={{ mb: 2 }}>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >

            <Box>

              <Typography fontWeight={700}>
                {item.product_name}
              </Typography>

              <Chip
                label={`₹${item.price}`}
                size="small"
                sx={{ bgcolor: "#e8f5e9", mt: .5 }}
              />

            </Box>

            <Stack direction="row" alignItems="center">

              <IconButton
                onClick={() => decreaseQty(item.id)}
                sx={{ bgcolor: "#e8f5e9" }}
              >
                <Remove/>
              </IconButton>

              <Typography mx={1} fontWeight={700}>
                {item.qty}
              </Typography>

              <IconButton
                onClick={() => increaseQty(item.id)}
                sx={{ bgcolor: "#e8f5e9" }}
              >
                <Add/>
              </IconButton>

            </Stack>

            <Typography fontWeight={700}>
              ₹{item.price * item.qty}
            </Typography>

            <IconButton
              color="error"
              onClick={() => removeItem(item.id)}
            >
              <Delete/>
            </IconButton>

          </Stack>

          <Divider sx={{ mt:2 }}/>

        </Box>

      ))}

      <Typography variant="h6" mt={2}>
        Total: ₹{grandTotal}
      </Typography>

      <Button
        variant="outlined"
        sx={{ mt:2, borderColor:green, color:green }}
        onClick={() => navigate("/products")}
      >
        Continue Shopping
      </Button>

    </Paper>

  );

  return (
    <Box sx={{ p:4, maxWidth:900, mx:"auto" }}>

      <Typography
        variant="h4"
        fontWeight={800}
        sx={{ color:green }}
        mb={3}
      >
        Checkout
      </Typography>

      <Stepper
        activeStep={activeStep}
        sx={{
          mb:4,
          "& .MuiStepIcon-root.Mui-completed": {
            color: green
          },
          "& .MuiStepIcon-root.Mui-active": {
            color: green
          }
        }}
      >
        {steps.map((label)=>(
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && renderCart()}

      {activeStep === 1 && (
        <Paper sx={paperStyle}>
          <Stack spacing={2}>

            <TextField
              label="Name"
              required
              value={address.name}
              onChange={(e)=>{
                const v = e.target.value;
                if (/^[A-Za-z ]*$/.test(v))
                  setAddress({...address,name:v});
              }}
            />

            <TextField
              label="Phone"
              required
              inputProps={{ maxLength:10 }}
              value={address.phone}
              onChange={(e)=>{
                const v = e.target.value.replace(/\D/g,"");
                if(v.length<=10)
                  setAddress({...address,phone:v});
              }}
            />

            <TextField
              label="Street"
              required
              value={address.street}
              onChange={(e)=>setAddress({...address,street:e.target.value})}
            />

            <TextField
              label="City"
              required
              value={address.city}
              onChange={(e)=>setAddress({...address,city:e.target.value})}
            />

            <TextField
              label="State"
              required
              value={address.state}
              onChange={(e)=>setAddress({...address,state:e.target.value})}
            />

            <TextField
              label="Pincode"
              required
              inputProps={{ maxLength:6 }}
              value={address.pincode}
              onChange={(e)=>{
                const v = e.target.value.replace(/\D/g,"");
                if(v.length<=6)
                  setAddress({...address,pincode:v});
              }}
            />

          </Stack>
        </Paper>
      )}

      {activeStep === 2 && (
        <Paper sx={paperStyle}>
          <FormControl fullWidth required>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              label="Payment Method"
              onChange={(e)=>setPaymentMethod(e.target.value)}
            >
              <MenuItem value="cod">Cash on Delivery</MenuItem>
              <MenuItem value="card">Credit/Debit Card</MenuItem>
              <MenuItem value="upi">UPI</MenuItem>
              <MenuItem value="netbanking">Netbanking</MenuItem>
            </Select>
          </FormControl>

          {paymentMethod !== "cod" && renderPaymentFields()}
        </Paper>
      )}

      {activeStep === 3 && (
        <Paper sx={paperStyle}>
          <Typography variant="h6" fontWeight={700}>
            Order Summary
          </Typography>

          {cart.map((i)=>(
            <Stack
              key={i.id}
              direction="row"
              justifyContent="space-between"
              mt={1}
            >
              <Typography>
                {i.product_name} × {i.qty}
              </Typography>

              <Typography>
                ₹{i.price*i.qty}
              </Typography>
            </Stack>
          ))}

          <Divider sx={{ my:2 }}/>

          <Typography fontWeight={700}>
            Total: ₹{grandTotal}
          </Typography>

          <Typography mt={1}>
            {address.name}, {address.street}, {address.city}, {address.state} - {address.pincode}
          </Typography>

          <Typography mt={1}>
            Payment: {paymentMethod.toUpperCase()}
          </Typography>

        </Paper>
      )}

      {activeStep === 4 && (
        <Paper sx={{...paperStyle,textAlign:"center"}}>
          <Typography variant="h4" fontWeight={800} sx={{color:green}}>
            🎉 Order Placed Successfully!
          </Typography>

          <Button
            variant="contained"
            sx={{...primaryBtn,mt:3}}
            onClick={()=>navigate("/my-orders")}
          >
            Go to My Orders
          </Button>
        </Paper>
      )}

      {activeStep < 4 && (
        <Stack direction="row" spacing={2} mt={4}>
          <Button
            disabled={activeStep===0}
            onClick={handleBack}
          >
            Back
          </Button>

          {activeStep === 3 ? (
            <Button
              variant="contained"
              sx={primaryBtn}
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={primaryBtn}
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Stack>
      )}

    </Box>
  );
};

export default Cart;