import { Button, Paper, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { GetTodayTopicResponse, ListTodayTopicResultResponse, TodayApi } from '../../api/TodayApi';
import { FireGaEvent } from '../../models/gtag';
import { AtomName } from '../../models/jotai/StudyJotai';
import useLevelUp from '../../models/util-hooks/useLevelUp';
import useSignin from '../../models/util-hooks/useSignin';
import useUser from '../../models/util-hooks/useUser';
import DictionarySearchSelector from '../common/DictionarySearchSelector';
import SuggestWordsList from '../study/SuggestWordsList';
import YourEnglishAndTranslationView from '../study/YourEnglishAndTranslationView';
import FloatingTryTodayQuestion from './FloatingTryTodayQuestion';
import TodayResultHistoryGraph from './TodayResultHistoryGraph';
import TodayShareButtons from './TodayShareButtons';
import TodayStudyRanking from './TodayStudyRanking';
interface Props {
    todayTopicResult: GetTodayTopicResponse
}



export default (props: Props) => {
    if (!process.browser) return null;
    const { question } = props.todayTopicResult
    const { answer } = props.todayTopicResult
    const { width, height } = useWindowSize()

    const [name] = useAtom(AtomName)
    const [results, setResults] = useState<ListTodayTopicResultResponse>([])

    const { user } = useUser()
    const { openSignin } = useSignin()
    const isYourAnswer = name === answer?.name //WARN: この判別は正しくない・・

    const router = useRouter()
    const { addExp } = useLevelUp()

    useEffect(() => {
        if (isYourAnswer && router.query.result) {
            addExp(answer.age, question.todayTopicId)
        }
    }, [isYourAnswer])



    useEffect(() => {
        const listResults = async () => {
            const results = await TodayApi.listTodayTopicResult(props.todayTopicResult.answer?.userId)
            setResults(results)
        }
        listResults()
    }, [])

    const conversion = () => {
        FireGaEvent({ action: "conversion_from_today", category: "register", label: "register" })
        openSignin()
    }


    return (
        <>
            <FloatingTryTodayQuestion />
            <main style={{
                width: 'auto',
                maxWidth: "600px",
                marginRight: "auto",
                marginLeft: "auto"
            }}>
                <Paper style={{
                    marginTop: "30px",
                    padding: "20px",
                    maxWidth: "600px",
                    marginRight: "auto",
                    marginLeft: "auto"
                }}>
                    <img src={`/static/ogp/slide_${(answer?.age || 0) + 1}.png`} style={{ width: "100%" }} />
                    <div style={{ height: 15 }} />

                    <h2 style={{ fontWeight: 700 }} >
                        {question.title}
                    </h2>

                    <p style={{ color: "#677284", marginTop: "15px" }}>
                        {question.description}
                    </p>

                    <Typography
                        variant="subtitle2"
                        style={{ marginBottom: 0, marginTop: 10 }}>
                        <b>{answer?.name}</b>さんが日本語で書いた意見
                    </Typography>
                    <Paper elevation={0} style={{ backgroundColor: "#eeeeee", padding: "20px" }}>
                        {answer?.japanese}
                    </Paper>

                    <Typography
                        variant="subtitle2"
                        style={{ marginBottom: 0, marginTop: 10 }}>
                        <b>{answer?.name}</b>さんが英語で書いた意見
                    </Typography>


                    <YourEnglishAndTranslationView
                        english={answer?.english || ""}
                        translation={answer?.translation || ""}
                    />

                    <div style={{ height: 25 }} />

                    <SuggestWordsList
                        english={answer?.english || ""}
                        translation={answer?.translation || ""} />

                    <div style={{ height: 15 }} />

                    {isYourAnswer && <TodayShareButtons
                        name={answer?.name || ""}
                        questionTitle={question.title}
                        resultId={answer?.resultId || ""} />}

                    <div style={{ height: 25 }} />

                    <TodayResultHistoryGraph
                        data={results.map(r => r.age)}
                        date={results.map(r => new Date(r.createdAt).toDateString())}
                        name={answer?.name || "anon"} />

                    <div style={{ height: 25 }} />

                    <TodayStudyRanking todayTopicId={props.todayTopicResult.question.todayTopicId} />

                    {!user?.attributes.sub && <div style={{ marginTop: 25 }} >
                        <Typography variant="h4" >
                            もっとEnglisterで英語年齢を上げませんか？
                        </Typography>
                        <Typography variant="body1" >
                            英語面接や英語環境で5歳児のようなことを言ってしまっていることに課題感を感じている人に特におすすめです。
                            本当に自分が使う言葉で英語を覚えていく体験をしてみませんか？
                        </Typography>
                        <div style={{ height: 10 }}></div>
                        <Button variant="contained" size="large" onClick={conversion}>
                            会員登録をしてみる(5秒)
                        </Button>
                    </div>}
                </Paper>


                <DictionarySearchSelector />
                <Confetti
                    width={width}
                    height={height}
                    run={isYourAnswer}
                    recycle={false}
                    tweenDuration={10000}
                    numberOfPieces={60 * (answer?.age || 0) + 50}
                />


            </main>
        </>
    );
}

