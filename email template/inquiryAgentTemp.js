export default function inquiryAgentTemp(data) {

    const { productData } = data
    const date = new Date(Date.now()).toISOString().split("T")[0];

    return (
        `
        <!DOCTYPE html>
<html>

<body
    style="margin: 0; padding: 10px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7fafc;">
    <!-- Main Container -->
    <div
        style="max-width: 640px; margin: 20px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">

        <!-- Header Section -->
        <div style="padding: 32px; text-align: center; border-bottom: 1px solid #e2e8f0;">
            <img src=https://res.cloudinary.com/dv3pq6g96/image/upload/v1738621880/Capture-removebg-preview_zvp7ek.png alt="Company Logo" style="height: 50px; margin-bottom: 16px;">
            <h2 style="margin: 0; color: #1a365d; font-size: 22px; font-weight: 600;">
                Thank You for Your Inquiry
            </h2>
            <p style="margin: 8px 0 0; color: #718096; font-size: 14px;">
                ✅ We've received your request and will respond shortly
            </p>
        </div>

        <!-- Product Section -->
        <div style="padding: 32px;">
            <!-- Product Image -->
            <div style="margin-bottom: 24px; border-radius: 8px; overflow: hidden; background: #ffffff;">
               <img src=${productData.images[0].url} alt=${productData.name}
                    style="width: 200px; height: 200px; display: block; border-bottom: 3px solid #f0f2f5; margin: 0 auto;">
            </div>

            <!-- Product Details -->
            <div style="margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px; color: #2d3748; font-size: 20px; font-weight: 600; text-align: center;">
                    ${productData.name}
                </h3>
                <div style"color: #4a5568;">
                    <div style="margin-bottom: 10px;">
                        <span style=" font-size: 13px; color: black;">Model: </span>
                        <span style="font-weight: 500; color: #4a5568;">${productData.modelCode}</span>
                    </div>
                    <div>
                        <span style=" font-size: 13px; color: black;">Year: </span>
                        <span style="font-weight: 500; color: #4a5568;"> ${productData.year}</span>
                    </div>
                </div>
            </div>

            <!-- Inquiry Details -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                <h4 style="margin: 0 0 16px; color: #2d3748; font-size: 16px; font-weight: 600;">
                    Inquiry Summary
                </h4>
                <div style="display: grid; gap: 12px; color: #4a5568;">
                    <div>
                        <span style="display: inline-block; width: 100px; color: black;">Submitted:</span>
                        <span> ${date}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Next Steps -->
        <div style="padding: 32px; background: #f7fafc; border-top: 1px solid #e2e8f0;">
            <h4 style="margin: 0 0 16px; color: #2d3748; font-size: 16px; font-weight: 600;">
                What Happens Next?
            </h4>
            <div style="color: #4a5568; line-height: 1.6; font-size: 14px;">
                <p style="margin: 0 0 12px;">1. Our team will review your inquiry within 24 hours</p>
                <p style="margin: 0 0 12px;">2. We'll contact you for any additional details</p>
                <p style="margin: 0;">3. You'll receive a formal quotation via email</p>
            </div>
        </div>

        <!-- Footer -->
        <div
            style="padding: 24px; text-align: center; background: #1a365d; color: #ffffff; border-radius: 0 0 12px 12px;">
            <p style="margin: 0 0 8px; font-size: 14px;">Global Trading Cars</p>
            <p style="margin: 0 0 8px; font-size: 12px; color: #cbd5e0;">123 Business Street, Karachi, Pakistan</p>
            <p style="margin: 0; font-size: 12px;">
                <a href="#" style="color: #90cdf4; text-decoration: none;">View Online</a> •
                <a href="#" style="color: #90cdf4; text-decoration: none;">Contact Support</a>
            </p>
        </div>
    </div>
</body>

</html>
    `
    )
}


