export interface Practitioner {
  resourceType: string;
  id: string;
  meta: {
    versionId: string;
    lastUpdated: string;
    source: string;
    tag: Array<{
      system: string;
      code: string;
    }>;
  };
  identifier: Array<{
    system: string;
    value: string;
  }>;
  active: boolean;
  name: Array<{
    family: string;
    given: string[];
    prefix: string[];
  }>;
  address: Array<{
    line: string[];
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>;
  gender: string;
}
