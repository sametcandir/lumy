import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    let products = getProducts();

    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    if (featured === 'true') {
      products = products.filter(p => p.featured);
    }

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.category) {
      return NextResponse.json({ success: false, error: 'Ürün adı ve kategori zorunludur' }, { status: 400 });
    }

    const parsedPrice = body.price !== undefined && body.price !== null && body.price !== '' ? Number(body.price) : null;
    const parsedWholesaleMin = body.wholesaleMin !== undefined && body.wholesaleMin !== null && body.wholesaleMin !== '' ? Number(body.wholesaleMin) : null;

    const newProduct = createProduct({
      name: body.name,
      category: body.category,
      price: parsedPrice,
      wholesaleMin: parsedWholesaleMin,
      image: body.image || 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop&q=80',
      description: body.description || '',
      inStock: body.inStock !== false,
      showStock: body.showStock !== false,
      featured: Boolean(body.featured),
      badge: body.badge || ''
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
