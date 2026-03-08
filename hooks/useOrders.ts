import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';

export interface OrderItem {
    productId: string;
    name: string;
    size: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string; // Document ID
    userId: string;
    userName: string;
    products: OrderItem[];
    totalPrice: number;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    orderDate: string; // ISO date string
    schoolName?: string;
}

export function useOrders(filterByUser: boolean = false) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (filterByUser && !user) {
            setOrders([]);
            setIsLoading(false);
            return;
        }

        let q = query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
        
        if (filterByUser && user?.uid) {
            // Need to create a composite indx in Firestore if combining where and orderBy on different fields.
            // For simplicity, we order locally if filtering, or query by userId.
            q = query(collection(db, 'orders'), where('userId', '==', user.uid));
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let ordersData: Order[] = [];
            querySnapshot.forEach((doc) => {
                ordersData.push({ id: doc.id, ...doc.data() } as Order);
            });
            
            // Sort client-side if we couldn't order by query
            if (filterByUser) {
                ordersData.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
            }

            setOrders(ordersData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching orders:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [filterByUser, user?.uid]);

    return { orders, isLoading };
}
