import { NextResponse } from 'next/server';
import { getProduct, updateProduct, deleteProduct } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProduct(params.id);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Ürün bulunamadı' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await updateProduct(params.id, {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.price !== undefined && { price: body.price === null || body.price === '' ? null : Number(body.price) }),
      ...(body.wholesaleMin !== undefined && { wholesaleMin: body.wholesaleMin === null || body.wholesaleMin === '' ? null : Number(body.wholesaleMin) }),
      ...(body.image !== undefined && { image: body.image }),
      ...(body.images !== undefined && { images: Array.isArray(body.images) ? body.images : [] }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.inStock !== undefined && { inStock: Boolean(body.inStock) }),
      ...(body.showStock !== undefined && { showStock: Boolean(body.showStock) }),
      ...(body.featured !== undefined && { featured: Boolean(body.featured) }),
      ...(body.showOnHomepage !== undefined && { showOnHomepage: Boolean(body.showOnHomepage) }),
      ...(body.badge !== undefined && { badge: body.badge }),
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Ürün güncellenemedi' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await deleteProduct(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Ürün bulunamadı' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Ürün başarıyla silindi' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
