import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface School {
    id: string;
    schoolId?: string;
    schoolName: string;
    district: string;
}

export function useSchools() {
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'schools'), orderBy('schoolName'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const schoolsData: School[] = [];
            querySnapshot.forEach((doc) => {
                schoolsData.push({ id: doc.id, ...doc.data() } as School);
            });
            setSchools(schoolsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching schools:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { schools, isLoading };
}
