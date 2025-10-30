import apper from "https://test-cdn.apper.io/actions/apper-actions.js";

apper.serve(async (req) => {
  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Method not allowed. Only POST requests are accepted.'
        }),
        {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse and validate request body
    let orderData;
    try {
      orderData = await req.json();
    } catch (parseError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid JSON in request body.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate required fields
    const requiredFields = ['total', 'items', 'shippingAddress'];
    const missingFields = requiredFields.filter(field => !orderData[field]);
    
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate total is a positive number
    if (typeof orderData.total !== 'number' || orderData.total <= 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid total amount. Must be a positive number.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate items array
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Order must contain at least one item.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get PayPal API credentials
    const paypalApiKey = await apper.getSecret('PAYPAL_API_KEY');
    
    if (!paypalApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'PayPal API key not configured. Please contact support.'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get PayPal access token
    const tokenResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${paypalApiKey}:`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          success: false,
          error: `PayPal authentication failed: ${errorData.error_description || 'Unknown error'}`
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Create PayPal order
    const paypalOrderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: orderData.total.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: orderData.subtotal.toFixed(2)
            },
            shipping: {
              currency_code: 'USD',
              value: orderData.shipping.toFixed(2)
            },
            tax_total: {
              currency_code: 'USD',
              value: orderData.tax.toFixed(2)
            }
          }
        },
        items: orderData.items.map(item => ({
          name: item.name,
          unit_amount: {
            currency_code: 'USD',
            value: item.price.toFixed(2)
          },
          quantity: item.quantity.toString()
        })),
        shipping: {
          name: {
            full_name: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`
          },
          address: {
            address_line_1: orderData.shippingAddress.address,
            admin_area_2: orderData.shippingAddress.city,
            admin_area_1: orderData.shippingAddress.state,
            postal_code: orderData.shippingAddress.zipCode,
            country_code: 'US'
          }
        }
      }],
      application_context: {
        return_url: `${orderData.returnUrl || 'http://localhost:5173'}/payment-success`,
        cancel_url: `${orderData.cancelUrl || 'http://localhost:5173'}/checkout`
      }
    };

    const createOrderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paypalOrderData)
    });

if (!createOrderResponse.ok) {
      const errorData = await createOrderResponse.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          success: false,
          error: `PayPal order creation failed: ${errorData.message || 'Unknown error'}`,
          details: errorData.details || []
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const paypalOrder = await createOrderResponse.json();
    
    // Find approval URL
    const approvalUrl = paypalOrder.links?.find(link => link.rel === 'approve')?.href;
    
    if (!approvalUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'PayPal approval URL not found in response.'
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Return success response with approval URL
    return new Response(
      JSON.stringify({
        success: true,
        orderId: paypalOrder.id,
        approvalUrl: approvalUrl,
        status: paypalOrder.status
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Payment processing failed: ${error.message}`
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});