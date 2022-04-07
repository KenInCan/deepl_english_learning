import { Cookie } from "@mui/icons-material"
import { Button } from "@mui/material"
import { useRouter } from "next/router"
import React from "react"
import MyHeader from "../../components/header/MyHeader"
import LevelUpProgress from "../../components/levelup/LevelUpProgress"
import StudyRecordMainFrame from "../../components/record/StudyRecordMainFrame"
import useLevelUp from "../../models/util-hooks/useLevelUp"

const RecordPage = () => {
    const router = useRouter()
    const { categorySlug } = router.query
    // const { addExp } = useLevelUp()


    return (
        <>
            <StudyRecordMainFrame categorySlug={categorySlug as string} />
            {/* <LevelUpProgress />
            <Button onClick={() => addExp(10, "aaa")}>add</Button> */}
        </>
    )
}

export default RecordPage