import DefaultLayout from "@/components/Layouts/DefaultLayout"
import { role } from "@/lib/data"

const page = () => {
    return (
        <DefaultLayout userRole={role}>
            <div className="">
                Accounts
            </div>
        </DefaultLayout>
    )
}

export default page