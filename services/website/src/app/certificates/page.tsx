import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@workspace/ui/components/ui/badge';
import { Button } from '@workspace/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@workspace/ui/components/ui/card';
import { FilterTabs } from '~/components/filter-tabs';
import { getPaginatedCertificates, CATEGORIES } from '~/data/certificates';
import { PaginationControls } from '~/components/pagination-controls';

export default async function CertificatesPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ filter?: string; page?: string }>;
}) {
  const searchParams = await searchParamsPromise;
  const filter = searchParams.filter ?? 'all';
  const page = parseInt(searchParams.page ?? '1', 10);
  const pageSize = 3 * 5;

  const { certificates, pagination } = getPaginatedCertificates(
    page,
    pageSize,
    filter
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Certificates</h1>
        <p className="text-muted-foreground">
          A collection of certificates and badges I&#39;ve earned throughout my
          career, including exam-based and participation certificates.
        </p>
      </div>

      <div className="relative mb-8 rounded-lg border">
        <div className="relative" style={{ aspectRatio: '2428/764' }}>
          <Image
            src="https://holopin.me/omarov"
            alt="Holopin badge board for @omarov"
            className="rounded-lg"
            fill
            sizes="100vw"
            priority={true}
          />
        </div>
      </div>

      <div className="mb-8">
        <FilterTabs
          categories={['all'].concat(Object.values(CATEGORIES))}
          activeFilter={filter}
        />

        {certificates.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">No certificates found</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((certificate) => (
                <Card
                  key={certificate.id}
                  className="flex flex-col overflow-hidden"
                >
                  <div className="bg-muted relative aspect-video w-full overflow-hidden">
                    <Image
                      src={certificate.image || '/placeholder.svg'}
                      alt={certificate.name}
                      className="object-contain"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33.33vw"
                    />
                  </div>
                  <CardContent className="flex flex-1 flex-col p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge
                        variant={
                          certificate.type === 'test' ? 'default' : 'outline'
                        }
                      >
                        {certificate.type === 'test'
                          ? 'Certification'
                          : 'Participation'}
                      </Badge>
                      <span className="text-muted-foreground text-sm">
                        {certificate.date.toLocaleDateString(undefined, {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="mb-1 text-lg font-semibold">
                      {certificate.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Issued by {certificate.issuer}
                    </p>
                  </CardContent>
                  {certificate.url && (
                    <CardFooter className="mt-auto border-t p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <Link href={certificate.url} target="_blank">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Certificate
                        </Link>
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>

            <PaginationControls
              totalPages={pagination.totalPages}
              currentPage={pagination.currentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
