import { Button } from "@/components/ui/button";

export default function Home(){
  console.log("API KEY", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <Button variant="outline">Button</Button>
    </div>
  )
}