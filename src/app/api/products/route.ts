import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    let products = await getProducts();

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

    const images = Array.isArray(body.images) ? body.images : (body.image ? [body.image] : []);

    const newProduct = await createProduct({
      name: body.name,
      category: body.category,
      price: parsedPrice,
      wholesaleMin: parsedWholesaleMin,
      image: images[0] || body.image || 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop&q=80',
      images: images,
      description: body.description || '',
      inStock: body.inStock !== false,
      showStock: body.showStock !== false,
      featured: Boolean(body.featured),
      showOnHomepage: body.showOnHomepage !== undefined ? Boolean(body.showOnHomepage) : true,
      badge: body.badge || ''
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
