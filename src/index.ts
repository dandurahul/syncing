
import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.post("/syncingresult", (req: Request, res: Response) => {
  try {
    if (!req.body) {
      throw new Error("Request body is empty");
    }

    console.log("hitting this");

    let calculatingData: any = req.body;
    let invoiceDetails: any[] = calculatingData.invoiceDetails;
    let PayloadTotalAmount: number = 0;
    let PayloadTotalDiscount: number = 0;

    // Calculate total amount and total discount
    for (let data of invoiceDetails) {
      PayloadTotalAmount += data.totalAmount;
      PayloadTotalDiscount += data.discountAmount;
    }

    let netAmount: number = PayloadTotalAmount - PayloadTotalDiscount;

    // Update calculatingData with the calculated totals
    calculatingData.netAmount = netAmount;
    calculatingData.totalAmount = PayloadTotalAmount;
    calculatingData.totalDiscount = PayloadTotalDiscount;
    calculatingData.tenderAmount = netAmount;

    // Ensure invoiceTenders exists and is an array
    if (Array.isArray(calculatingData.invoiceTenders)) {
      for (let item of calculatingData.invoiceTenders) {
        item.tenderAmount = netAmount;
      }
    }

    let payload: any = {
      PayloadTotalAmount,
      PayloadTotalDiscount,
      netAmount,
      calculatingData,
    };

    res.json({
      status: "success",
      data: payload,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


