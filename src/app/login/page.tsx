
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useEffect } from "react"
import { FirebaseError } from "firebase/app"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"
import { signInWithEmail, signInWithGoogle, sendSignInLink, isSignInLink, signInWithLink } from "@/lib/firebase/auth"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Mail } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,35.245,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
        </svg>
    )
}

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [isLinkSignIn, setIsLinkSignIn] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const handleEmailLinkSignIn = async () => {
        if (isSignInLink(window.location.href)) {
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                toast({
                    variant: "destructive",
                    title: "Sign In Failed",
                    description: "Your sign-in link is invalid or expired. Please try again.",
                });
                return;
            }
            setIsLoading(true);
            try {
                await signInWithLink(email, window.location.href);
                window.localStorage.removeItem('emailForSignIn');
                handleSuccess();
            } catch (error) {
                handleError(error as Error);
            } finally {
                setIsLoading(false);
            }
        }
    };
    handleEmailLinkSignIn();
  }, [router, toast]);
  
  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "You have been logged in.",
    })
    router.push("/feed")
  }

  const handleError = (error: Error) => {
    let description = error.message;
    if (error instanceof FirebaseError && error.code === 'auth/invalid-credential') {
        description = "Invalid email or password. Please try again.";
    }
    toast({
        variant: "destructive",
        title: "Login Failed",
        description: description,
    });
  }

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    if (isLinkSignIn) {
      try {
        await sendSignInLink(data.email)
        window.localStorage.setItem('emailForSignIn', data.email);
        setEmailSent(true)
      } catch (error) {
        handleError(error as Error)
      } finally {
        setIsLoading(false)
      }
    } else {
      try {
          if (!data.password) {
              form.setError("password", { type: "manual", message: "Password is required." });
              setIsLoading(false);
              return;
          }
          await signInWithEmail(data.email, data.password);
          handleSuccess();
      } catch (error) {
          handleError(error as Error);
      } finally {
          setIsLoading(false);
      }
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
        await signInWithGoogle();
        handleSuccess();
    } catch (error) {
        handleError(error as Error);
    } finally {
        setIsLoading(false);
    }
  }

  if (emailSent) {
    return (
       <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
            <div className="flex justify-center mb-6">
                 <Link href="/" className="flex items-center gap-2">
                    <Logo className="h-10 w-10 text-primary" />
                    <h1 className="text-2xl font-bold text-foreground">TalentTrack</h1>
                </Link>
            </div>
            <Card>
                <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="mt-4">Check your email</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        We've sent a sign-in link to <strong>{form.getValues("email")}</strong>.
                        Please check your inbox and follow the link to log in.
                    </p>
                    <Button variant="link" onClick={() => setEmailSent(false)} className="mt-4">
                        Use a different email
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2">
                <Logo className="h-10 w-10 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">TalentTrack</h1>
            </Link>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome Back!</CardTitle>
            <CardDescription>
                {isLinkSignIn ? "Enter your email to receive a sign-in link." : "Sign in to continue to your profile."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!isLinkSignIn && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLinkSignIn ? "Send Sign-in Link" : "Log In"}
                </Button>
              </form>
            </Form>

            <Button variant="link" className="mt-2 w-full" onClick={() => setIsLinkSignIn(!isLinkSignIn)}>
                {isLinkSignIn ? "Sign in with password instead" : "Sign in with email link"}
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <GoogleIcon className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
