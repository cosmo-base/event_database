import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { Database, Map, Calendar, Filter, PlusCircle } from "lucide-react"

export default function EventsPage() {
  return (
    <ContentPageLayout
      title="Cosmo Base Event Database"
      level={3}
      levelTitle=""
      logo="CBED"
    >
      {/* Hero Section */}
      <div className="glass-card rounded-xl p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary/20">
            <Database className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              あなたにぴったりの宇宙イベントが、ここなら見つかる。
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                全国で開催される宇宙関連のイベント情報を、カレンダー形式で一覧できるデータベースです。「どこで探せばいいか分からない」「気づいたら終わっていた」という悩みを解決するために生まれました。
              </p>
              <p>
                気軽な交流会から専門的なカンファレンスまで幅広く掲載しており、探しやすさと見つけやすさにこだわっています。一つひとつ探し回らなくても、ここを見るだけでイベントの全体像をつかむことができます。
              </p>
              <p>
                じっくり学びたい方も、まずは気軽に参加してみたい方も、ご自身の興味やスケジュールに合わせて探せます。一覧を眺めることで生まれる「こんなイベントもあるんだ」という新しい発見をお楽しみください。
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                掲載されているイベントの内容は予告なく変更・中止される場合があります。
                また、当サイトに掲載されたイベントへの参加によって生じたいかなるトラブルや損害等についても、Cosmo Base運営では一切の責任を負いかねます。
                ご参加にあたってはご自身の判断と責任において、必ず主催者の公式情報をご確認ください。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Map className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">地図で探す</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            日本地図上でイベントを探せます。<br />
            お近くのイベントを見つけましょう。
          </p>
          <Link href="/CBED/map">
            <Button variant="outline" className="w-full">
              地図で探す
            </Button>
          </Link>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">カレンダーで探す</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            月間カレンダーでイベントをチェック。<br />
            スケジュール管理に便利です。
          </p>
          <Link href="/CBED/calendar">
            <Button variant="outline" className="w-full">
              カレンダーで探す
            </Button>
          </Link>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">詳細検索</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            日付、エリア、カテゴリ、参加費など<br />様々な条件で絞り込み検索。
          </p>
          <Link href="/CBED/search">
            <Button variant="outline" className="w-full">
              詳細検索
            </Button>
          </Link>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <PlusCircle className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">イベント登録</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            記載されていない宇宙のイベントがありましたら、お手数ですがお書きいただけますと幸いです。<br />
            皆様からの情報提供が、多くの宇宙ファンの助けになります！
          </p>
          <Link href="/CBED/register">
            <Button variant="outline" className="w-full">
              イベント登録
            </Button>
          </Link>
        </div>
      </div>
    </ContentPageLayout>
  )
}
