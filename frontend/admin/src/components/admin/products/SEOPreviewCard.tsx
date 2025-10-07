import { Search, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SEOPreviewCardProps {
  name: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  featuredImage: string;
}

export default function SEOPreviewCard({
  name,
  slug,
  metaTitle,
  metaDescription,
  metaKeywords,
  featuredImage,
}: SEOPreviewCardProps) {
  const finalTitle = metaTitle || name;
  const finalDescription =
    metaDescription || `Buy ${name} - Premium quality fabrics`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          SEO Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Google Search Preview */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Google Search Result
          </h4>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
            <div className="space-y-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                https://yourstore.com/products/{slug}
              </p>
              <h3 className="text-lg text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                {finalTitle}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {finalDescription}
              </p>
            </div>
          </div>
        </div>

        {/* SEO Data */}
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Meta Title ({finalTitle.length}/60 characters)
            </p>
            <p className="text-sm text-gray-900 dark:text-white">
              {finalTitle || (
                <span className="text-gray-400 italic">Not set</span>
              )}
            </p>
            {finalTitle.length > 60 && (
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                ⚠️ Title is too long. Recommended: 50-60 characters
              </p>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Meta Description ({finalDescription.length}/160 characters)
            </p>
            <p className="text-sm text-gray-900 dark:text-white">
              {finalDescription || (
                <span className="text-gray-400 italic">Not set</span>
              )}
            </p>
            {finalDescription.length > 160 && (
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                ⚠️ Description is too long. Recommended: 150-160 characters
              </p>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Meta Keywords
            </p>
            {metaKeywords && metaKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {metaKeywords.map((keyword, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No keywords set</p>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Featured Image (OG Image)
            </p>
            <img
              src={featuredImage}
              alt={name}
              className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
