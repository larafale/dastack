import { Button } from "@/components/ui/button"
import { User } from "lucide-react"


const UserButton = () => {
  return (
    <Button className='rounded-none w-[50px]' variant="ghost" tabIndex={-1} size="lg">
      <User />
    </Button>
  )
}

export default UserButton;