import { useClaims } from "@/hooks/useClaims";
import { AppLayout } from "@/components/AppLayout";
import { FileText, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const CHART_COLORS = [
  "hsl(220, 80%, 56%)", // primary
  "hsl(152, 60%, 42%)", // success
  "hsl(0, 72%, 51%)",   // destructive
  "hsl(38, 92%, 50%)",  // warning
];

export default function Dashboard() {
  const { data: claims, isLoading } = useClaims();

  const stats = {
    total: claims?.length ?? 0,
    approved: claims?.filter((c) => c.status === "Approved").length ?? 0,
    rejected: claims?.filter((c) => c.status === "Rejected").length ?? 0,
    underReview: claims?.filter((c) => c.status === "Under Review").length ?? 0,
  };

  const pieData = [
    { name: "Approved", value: stats.approved },
    { name: "Rejected", value: stats.rejected },
    { name: "Under Review", value: stats.underReview },
    { name: "Submitted", value: stats.total - stats.approved - stats.rejected - stats.underReview },
  ].filter((d) => d.value > 0);

  const barData = [
    { name: "Submitted", count: stats.total - stats.approved - stats.rejected - stats.underReview },
    { name: "Under Review", count: stats.underReview },
    { name: "Approved", count: stats.approved },
    { name: "Rejected", count: stats.rejected },
  ];

  const summaryCards = [
    { label: "Total Claims", value: stats.total, icon: FileText, color: "text-primary" },
    { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-[hsl(var(--success))]" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-destructive" },
    { label: "Under Review", value: stats.underReview, icon: Clock, color: "text-[hsl(var(--warning))]" },
  ];

  const recentClaims = claims?.slice(0, 5) ?? [];

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card) =>
            isLoading ? (
              <Skeleton key={card.label} className="h-28 rounded-xl" />
            ) : (
              <div
                key={card.label}
                className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 animate-slide-up hover:shadow-md transition-shadow"
              >
                <div className={`p-3 rounded-lg bg-accent ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="text-2xl font-bold text-foreground">{card.value}</p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">Status Distribution</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No data yet
              </div>
            )}
            <div className="flex flex-wrap gap-3 mt-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  {d.name}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">Claims Overview</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Recent Activity</h3>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
            </div>
          ) : recentClaims.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No claims yet. Add your first claim!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {claim.customer_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {claim.claim_type} · ${Number(claim.claim_amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={claim.status} />
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(claim.created_at), "MMM d")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
