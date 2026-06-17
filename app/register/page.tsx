"use client"

import { useState } from "react"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Send, Loader2 } from "lucide-react"

export default function EventRegisterPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      // 抽出したGoogleフォームのaction URL
      await fetch(
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeyb8c4taYW7HP3tKjTfbHoQSp-M-AedhOzsBMM6RWLww-tnA/formResponse",
        {
          method: "POST",
          mode: "no-cors",
          body: formData,
        }
      )
      setSubmitted(true)
    } catch (error) {
      console.error("送信エラー:", error)
      alert("送信に失敗しました。時間をおいて再度お試しください。")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ContentPageLayout
      title="イベント登録"
      level={3}
      levelTitle=""
      logo="CBED"
    >
      <div className="glass-card rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/20">
            <PlusCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              イベント情報の登録
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Cosmo Base Event Databaseに記載されていない宇宙のイベントがありましたら、お手数ですがお書きいただけますと幸いです。<br />
              皆様からの情報提供が、多くの宇宙ファンの助けになります！
            </p>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="glass-card rounded-xl p-8 text-center animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 rounded-full bg-accent/20 w-fit mx-auto mb-4">
            <Send className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            イベント情報の登録が完了しました
          </h3>
          <p className="text-muted-foreground mb-6">
            情報提供ありがとうございます。内容を確認の上、データベースに反映させていただきます。
          </p>
          <Button
            variant="outline"
            onClick={() => setSubmitted(false)}
          >
            続けて別のイベントを登録する
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 space-y-6">
          {/* イベント名 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              イベント名 <span className="text-destructive">*</span>
            </label>
            <Input
              name="entry.2070548452"
              placeholder="例: 夏休み親子天文教室"
              required
              className="bg-secondary/50 border-border/50"
            />
          </div>

          {/* 開催日 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              開催日 <span className="text-destructive">*</span>
            </label>
            <Input
              type="date"
              name="entry.372170205"
              required
              className="bg-secondary/50 border-border/50 w-full md:w-auto"
            />
          </div>

          {/* 主催者 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              主催者 <span className="text-destructive">*</span>
            </label>
            <Input
              name="entry.727585212"
              placeholder="例: 〇〇科学館、宙ガール協会"
              required
              className="bg-secondary/50 border-border/50"
            />
          </div>

          {/* 主催者チェックボックス */}
          <div className="flex items-center space-x-2 bg-secondary/30 p-4 rounded-lg border border-border/50">
            <input
              type="checkbox"
              id="isOrganizer"
              name="entry.1648238544"
              value="主催者である。"
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary bg-secondary border-border"
            />
            <label
              htmlFor="isOrganizer"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
            >
              私はこのイベントの主催者です
            </label>
          </div>

          {/* イベント概要 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              イベント概要 <span className="text-muted-foreground text-xs ml-2">【任意】</span>
            </label>
            <Textarea
              name="entry.761888806"
              placeholder="イベントの詳しい内容や、参加費、対象年齢、申し込み方法などがあればご記入ください"
              rows={5}
              className="bg-secondary/50 border-border/50"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary/70 hover:bg-primary/60 text-primary-foreground transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                送信中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                イベントを登録
              </>
            )}
          </Button>
        </form>
      )}
    </ContentPageLayout>
  )
}