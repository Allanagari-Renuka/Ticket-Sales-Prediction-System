import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { PublicHeader } from "@/components/public-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, Smartphone, Banknote, ArrowLeft, CheckCircle2 } from "lucide-react";

type PaymentMethod = "upi" | "card" | "cash";

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock booking data - will be replaced with actual data
  const booking = {
    movieTitle: "Sample Movie",
    screenName: "Screen 1",
    startTime: new Date(),
    seats: [{ row: "D", number: 5 }, { row: "D", number: 6 }],
    totalAmount: 500,
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowSuccess(true);
    
    // Redirect to confirmation page after 2 seconds
    setTimeout(() => {
      setLocation("/booking/confirmation/mock-booking-id");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Seats
        </Button>

        <h1 className="font-display font-bold text-3xl mb-8" data-testid="text-checkout-title">
          Complete Your Booking
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Method Selection */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                  <div className="space-y-3">
                    {/* UPI */}
                    <Label
                      htmlFor="upi"
                      className="flex items-center gap-4 p-4 border rounded-md cursor-pointer hover-elevate has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <RadioGroupItem value="upi" id="upi" data-testid="radio-upi" />
                      <Smartphone className="h-5 w-5" />
                      <div className="flex-1">
                        <div className="font-medium">UPI Payment</div>
                        <div className="text-sm text-muted-foreground">GPay, PhonePe, Paytm</div>
                      </div>
                    </Label>

                    {/* Card */}
                    <Label
                      htmlFor="card"
                      className="flex items-center gap-4 p-4 border rounded-md cursor-pointer hover-elevate has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <RadioGroupItem value="card" id="card" data-testid="radio-card" />
                      <CreditCard className="h-5 w-5" />
                      <div className="flex-1">
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-muted-foreground">Visa, Mastercard, Amex</div>
                      </div>
                    </Label>

                    {/* Cash */}
                    <Label
                      htmlFor="cash"
                      className="flex items-center gap-4 p-4 border rounded-md cursor-pointer hover-elevate has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <RadioGroupItem value="cash" id="cash" data-testid="radio-cash" />
                      <Banknote className="h-5 w-5" />
                      <div className="flex-1">
                        <div className="font-medium">Cash at Counter</div>
                        <div className="text-sm text-muted-foreground">Pay at theatre</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Details Form */}
            {paymentMethod === "upi" && (
              <Card>
                <CardHeader>
                  <CardTitle>Enter UPI ID</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="upi-id">UPI ID</Label>
                    <Input
                      id="upi-id"
                      placeholder="yourname@upi"
                      data-testid="input-upi"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You will receive a payment request on your UPI app
                  </p>
                </CardContent>
              </Card>
            )}

            {paymentMethod === "card" && (
              <Card>
                <CardHeader>
                  <CardTitle>Card Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      data-testid="input-card-number"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        data-testid="input-expiry"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        maxLength={3}
                        data-testid="input-cvv"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentMethod === "cash" && (
              <Card>
                <CardContent className="py-6">
                  <p className="text-muted-foreground">
                    Please collect your tickets from the counter before the show time.
                    Make sure to carry a valid ID for verification.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-semibold mb-1" data-testid="text-movie-title">
                    {booking.movieTitle}
                  </div>
                  <div className="text-sm text-muted-foreground" data-testid="text-screen">
                    {booking.screenName}
                  </div>
                  <div className="text-sm text-muted-foreground" data-testid="text-showtime">
                    {booking.startTime.toLocaleString()}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="text-sm font-medium mb-2">Seats</div>
                  <div className="flex flex-wrap gap-2">
                    {booking.seats.map((seat, i) => (
                      <Badge key={i} data-testid={`badge-seat-${i}`}>
                        {seat.row}{seat.number}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Total Amount</span>
                  <span className="font-display font-bold text-2xl" data-testid="text-total">
                    ₹{booking.totalAmount}
                  </span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePayment}
                  disabled={isProcessing}
                  data-testid="button-pay"
                >
                  {isProcessing ? "Processing..." : "Confirm Payment"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-500/10 p-3 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Payment Successful!</DialogTitle>
            <DialogDescription className="text-center">
              Your booking has been confirmed. Redirecting to your e-ticket...
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
