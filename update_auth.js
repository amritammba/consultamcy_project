const fs = require('fs');
const file = './context/AuthContext.tsx';
let content = fs.readFileSync(file, 'utf8');

// replace login
content = content.replace(
    /const login = async \(email: string, password: string\) => {[\s\S]*?router\.replace\('\/\(tabs\)'\);[\s\S]*?\} catch \(error\) {[\s\S]*?console\.error\("Login Error:", error\);[\s\S]*?setIsLoading\(false\);[\s\S]*?throw error;[\s\S]*?\};/,
`const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
            
            let userRole = 'user';
            if (userDoc.exists()) {
                const data = userDoc.data();
                userRole = data.role || 'user';
            }
            
            if (userRole === 'admin') {
                router.replace('/admin');
            } else {
                router.replace('/(tabs)');
            }
        } catch (error) {
            console.error("Login Error:", error);
            setIsLoading(false);
            throw error;
        }
    };`
);

// replace signup
content = content.replace(
    /router\.replace\('\/\(tabs\)'\);\s*\} catch \(error\) \{\s*console\.error\("Signup Error:", error\);\s*setIsLoading\(false\);\s*throw error;\s*\};/,
`router.replace('/(tabs)');
        } catch (error: any) {
            console.error("Signup Error:", error);
            setIsLoading(false);
            
            if (error.code === 'auth/email-already-in-use') {
                throw new Error('Account already exists. Please login.');
            } else if (error.code === 'auth/invalid-email') {
                throw new Error('Invalid email address format.');
            } else if (error.code === 'auth/weak-password') {
                throw new Error('Password is too weak. Please use at least 6 characters.');
            }
            
            throw error;
        }
    };`
);

fs.writeFileSync(file, content);
