export default function inquirySellerTemp(data) {

    const { productData, inquireData } = data
    return (
        `
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="margin: 0; padding: 20px 0; background: #f5f7fa;">
    <!-- Email Wrapper -->
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <tr>
            <td style="padding: 30px 25px; background: #ffffff; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: #1a365d; font-family: Arial, sans-serif; font-size: 24px;">
                    🚘 New Car Inquiry Received
                </h1>
            </td>
        </tr>

        <!-- Vehicle Image -->
        <tr style="background: #ffffff;">
            <td style="padding: 0;">
                <img src=${productData.images[0].url} alt=${productData.name}
                    style="width: 200px; height: 200px; display: block; border-bottom: 3px solid #f0f2f5; margin: 0 auto;">
            </td>
        </tr>

        <!-- Vehicle Details -->
        <tr>
            <td style="padding: 25px; background: #ffffff;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-bottom: 15px;">
                            <h2 style="margin: 0; color: #2d3748; font-family: Arial, sans-serif; font-size: 20px; text-align: center;">
                                ${productData.name}
                            </h2>
                        </td>
                    </tr>
                    <tr style="font-size: 1.1rem; ">
                        <td>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="100%" style="padding: 8px 0;">
                                        <strong
                                            style="color: #718096; font-family: Arial, sans-serif; font-weight: bolder;">Model:</strong>
                                        <span
                                            style="color: #2d3748; font-family: Arial, sans-serif; font-size: 1.0rem; font-weight: bold;">${productData.modelCode}</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr style="font-size: 1.1rem; ">
                        <td>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="100%" style="padding: 8px 0;">
                                        <strong
                                            style="color: #718096; font-family: Arial, sans-serif; font-weight: bolder;">Reference No:</strong>
                                        <span
                                            style="color: #2d3748; font-family: Arial, sans-serif; font-size: 1.0rem; font-weight: bold;">${productData.referenceNo}</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr style="font-size: 1.1rem; ">
                        <td>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="100%" style="padding: 8px 0;">
                                        <strong
                                            style="color: #718096; font-family: Arial, sans-serif; font-weight: bolder">Year:</strong>
                                        <span
                                            style="color: #2d3748; font-family: Arial, sans-serif; font-size: 1.0rem; font-weight: bold;">${productData.year}</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr style="font-size: 1.1rem; ">
                        <td>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="50%" style="padding: 8px 0;">
                                        <strong
                                            style="color: #718096; font-family: Arial, sans-serif; font-weight: bolder">Color:</strong>
                                        <span
                                            style="color: #2d3748; font-family: Arial, sans-serif; font-size: 1.0rem; font-weight: bold;">${productData.color}</span>
                                    </td>
                                    <td width="50%" style="padding: 8px 0;">
                                        <strong
                                            style="color: #718096; font-family: Arial, sans-serif; font-weight: bolder">Fuel
                                            Type:</strong>
                                        <span
                                            style="color: #2d3748; font-family: Arial, sans-serif; font-size: 1.0rem; font-weight: bold;">${productData.fuelType}</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <hr />
            </td>
        </tr>

        <!-- Customer Details -->
        <tr>
            <td style="padding: 25px; background: #ffffff;">
                <h1
                    style=" color: #1a365d; text-align: center; font-family: Arial, sans-serif; font-size: 1.7rem; text-decoration: underline; margin: 0 0 15px 0;  ">
                    Customer Details</h1>
                <table width="100%" cellpadding="0" cellspacing="0"
                    style="border-collapse: collapse; font-size: 1.0rem;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #edf2f7;">
                            <strong style="color: #718096; font-family: Arial, sans-serif;">👤 Name:</strong>
                            <span style="color: #2d3748; font-family: Arial, sans-serif;"> ${inquireData.name}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #edf2f7;">
                            <strong style="color: #718096; font-family: Arial, sans-serif;">📧 Email:</strong>
                            <a href="mailto:${inquireData.email}"
                                style="color: #3182ce; text-decoration: none; font-family: Arial, sans-serif;">
                                ${inquireData.email}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #edf2f7;">
                            <strong style="color: #718096; font-family: Arial, sans-serif;">📱 Contact:</strong>
                            <span style="color: #2d3748; font-family: Arial, sans-serif;">
                                ${inquireData.phoneNumber}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0;">
                            <strong style="color: #718096; font-family: Arial, sans-serif;">📍 Location:</strong>
                            <span style="color: #2d3748; font-family: Arial, sans-serif;">${inquireData.city},
                                ${inquireData.country}</span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Remarks Section -->
        <tr>
            <td style="padding: 25px; background: #ffffff; border-radius: 0 0 8px 8px;">
                <div style="background: #f8fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #3182ce;">
                    <h3 style="margin: 0 0 15px 0; color: #2d3748; font-family: Arial, sans-serif;">📝 Customer Remarks
                    </h3>
                    <p style="margin: 0; color: #4a5568; font-family: Arial, sans-serif; line-height: 1.5;">
                        ${inquireData.remarks}
                    </p>
                </div>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="padding: 25px 0; text-align: center;">
                <p style="margin: 0; color: #718096; font-family: Arial, sans-serif; font-size: 14px;">
                    Sent by Global Trading Cars<br>
                    <a href="http://globaltradingcars.com" style="color: #3182ce; text-decoration: none;">🌐
                        www.globaltradingcars.com</a>
                </p>
            </td>
        </tr>
    </table>
</body>

</html>
    `
    )
}
