import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// 1. Define the 'shape' of a news article object for TypeScript
interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  published: string;
  author: string;
}

// 2. Define the component. It receives one prop: 'article'.
// We tell TypeScript that the 'article' prop must match the NewsArticle interface.
function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg">
      {/* 3. Conditionally render the image only if it exists and is not 'None' */}
      {article.image && article.image !== 'None' && (
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}

      {/* 4. The CardHeader contains the title */}
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
      </CardHeader>

      {/* 5. The CardContent contains the description */}
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{article.description}</p>
      </CardContent>

      {/* 6. The CardFooter contains the link to the full article */}
      <CardFooter>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer" // Corrected typo
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          Read More &rarr; {/* Corrected arrow code */}
        </a>
      </CardFooter>
    </Card>
  );
}

// 7. Export the component so we can use it elsewhere
export default NewsCard;