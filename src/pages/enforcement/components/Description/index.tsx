import { View } from "@tarojs/components";
import './index.less'
import { useSelector } from "react-redux";
import { selectUserInfo } from "@/store/slice/user";

export default function Index() {
  const userInfo = useSelector(selectUserInfo)
  return (
      <View className="shadow-top bg-white text-[#6c6c6c] relative h-16 flex items-center justify-center text-sm shadow-sm">
        {userInfo.orgName}
      </View>
  )
}
