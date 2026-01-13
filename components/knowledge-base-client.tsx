"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { UploadDocumentModal } from "@/components/upload-document-modal"
import { useAppSelector } from "@/lib/redux/hooks"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, Eye, FileText, Filter, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@/components/ui/empty"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface KnowledgeBaseClientProps {
  role?: string
}

type SortField = "name" | "country" | "region" | "createdAt"
type SortDirection = "asc" | "desc" | null

export function KnowledgeBaseClient({ role = "trainer" }: KnowledgeBaseClientProps) {
  const products = useAppSelector((state) => state.product.products)
  const documents = useAppSelector((state) => state.document.documents)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [categoryFilter, setCategoryFilter] = useState<string>(searchParams.get("category") || "all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  useEffect(() => {
    const scrollPos = sessionStorage.getItem("kb-scroll-position")
    if (scrollPos) {
      requestAnimationFrame(() => {
        window.scrollTo(0, Number.parseInt(scrollPos))
        sessionStorage.removeItem("kb-scroll-position")
      })
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (categoryFilter !== "all") params.set("category", categoryFilter)

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    window.history.replaceState(null, "", newUrl)
  }, [searchQuery, categoryFilter, pathname, searchParams])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortField(null)
        setSortDirection(null)
      } else {
        setSortDirection("asc")
      }
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="h-3 w-3 ml-1 opacity-40" />
    }
    if (sortDirection === "asc") {
      return <ChevronUp className="h-3 w-3 ml-1" />
    }
    return <ChevronDown className="h-3 w-3 ml-1" />
  }

  // Get all unique categories from documents
  const allCategories = Array.from(new Set(documents.map((doc) => doc.purpose)))

  const filteredProducts = products
    .filter((product) => {
      const productDocs = documents.filter((doc) => doc.productId === product.id)
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.region.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = categoryFilter === "all" || productDocs.some((doc) => doc.purpose === categoryFilter)

      const matchesDate = (() => {
        if (!dateRange?.from) return true
        const productDate = new Date(product.createdAt)
        if (productDate < dateRange.from) return false
        if (dateRange.to) {
          const endOfDay = new Date(dateRange.to)
          endOfDay.setHours(23, 59, 59, 999)
          if (productDate > endOfDay) return false
        }
        return true
      })()

      return matchesSearch && matchesCategory && matchesDate
    })
    .sort((a, b) => {
      if (!sortField || !sortDirection) return 0

      let aVal: any = a[sortField as keyof typeof a]
      let bVal: any = b[sortField as keyof typeof b]

      if (sortField === "createdAt") {
        aVal = new Date(a.createdAt).getTime()
        bVal = new Date(b.createdAt).getTime()
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
      return 0
    })

  const handleRowClick = (productId: string) => {
    sessionStorage.setItem("kb-scroll-position", window.scrollY.toString())
    const baseUrl = pathname.split("/knowledge-base")[0] + "/knowledge-base"
    router.push(`${baseUrl}/${productId}`)
  }

  const handlePreview = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    sessionStorage.setItem("kb-scroll-position", window.scrollY.toString())
    const baseUrl = pathname.split("/knowledge-base")[0] + "/knowledge-base"
    router.push(`${baseUrl}/${productId}`)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Products & Documents</CardTitle>
            <UploadDocumentModal />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map((category) => (
                  <SelectItem key={category} value={category} className="capitalize">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DateRangePicker value={dateRange} onChange={setDateRange} placeholder="Date Range" />
          </div>

          {filteredProducts.length > 0 ? (
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("name")}>
                      <div className="flex items-center">
                        Product Name
                        <SortIcon field="name" />
                      </div>
                    </TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("country")}>
                      <div className="flex items-center">
                        Country
                        <SortIcon field="country" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("region")}>
                      <div className="flex items-center">
                        Region
                        <SortIcon field="region" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort("createdAt")}>
                      <div className="flex items-center">
                        Date Created
                        <SortIcon field="createdAt" />
                      </div>
                    </TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const productDocs = documents.filter((doc) => doc.productId === product.id)
                    const purposes = Array.from(new Set(productDocs.map((doc) => doc.purpose)))

                    const displayPurposes = purposes.slice(0, 2)
                    const remainingCount = purposes.length - 2
                    const remainingPurposes = purposes.slice(2)

                    return (
                      <TableRow
                        key={product.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(product.id)}
                      >
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {displayPurposes.map((purpose) => (
                              <Badge key={purpose} variant="secondary" className="capitalize">
                                {purpose}
                              </Badge>
                            ))}
                            {remainingCount > 0 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge variant="outline" className="capitalize">
                                      +{remainingCount}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" align="center" className="p-3">
                                    <div className="space-y-1.5">
                                      <p className="font-semibold text-sm">Additional Categories</p>
                                      <div className="space-y-1">
                                        {remainingPurposes.map((purpose) => (
                                          <div key={purpose} className="text-sm capitalize flex items-start gap-1.5">
                                            <span className="mt-0.5">•</span>
                                            <span>{purpose}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{product.country}</TableCell>
                        <TableCell>{product.region}</TableCell>
                        <TableCell>
                          {new Date(product.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handlePreview(product.id, e)}
                            className="gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            Preview
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Empty className="border">
              <EmptyContent>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileText className="h-6 w-6" />
                  </EmptyMedia>
                  <EmptyTitle>No products found</EmptyTitle>
                  <EmptyDescription>
                    {searchQuery || categoryFilter !== "all" || dateRange
                      ? "Try adjusting your search or filters"
                      : "Get started by uploading your first document"}
                  </EmptyDescription>
                </EmptyHeader>
                {!searchQuery && categoryFilter === "all" && !dateRange && <UploadDocumentModal />}
              </EmptyContent>
            </Empty>
          )}
        </CardContent>
      </Card>
    </>
  )
}
