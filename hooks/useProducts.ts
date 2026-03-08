import { useState, useEffect } from 'react';
import { collection, query, getDocs, onSnapshot, DocumentData, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface Product {
    id: string;
    productId?: string;
    schoolId?: string;
    schoolName?: string;
    district?: string;
    productName: string;
    category: string;
    sizes: string[];
    price: number;
    stock: number;
    imageUrl?: string;
    imageURL?: string;
    deliveryDays?: number;
    color?: string;
}

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'products'), orderBy('productName'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const productsData: Product[] = [];
            querySnapshot.forEach((doc) => {
                productsData.push({ id: doc.id, ...doc.data() } as Product);
            });
            setProducts(productsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching products:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { products, isLoading };
}
