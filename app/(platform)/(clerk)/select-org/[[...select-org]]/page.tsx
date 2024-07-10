import { OrganizationList } from "@clerk/nextjs";

export default function OrganizationPage() {
  return (
    <div>
          <OrganizationList
              hidePersonal
              afterSelectOrganizationUrl='/organization/:id'
              afterCreateOrganizationUrl='/organization/:id'
          />
    </div>
  );
}