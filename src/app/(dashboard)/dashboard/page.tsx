import Button from '@/components/ui/Button'
import { authOptions } from '@/utils/auth'
import { getServerSession } from 'next-auth'
import {FC} from 'react'


interface pageProps {}


const page  = async () => {

  const session = await getServerSession(authOptions);

  return (
    <pre>
      {JSON.stringify(session)}
    </pre>
  )
}

export default page