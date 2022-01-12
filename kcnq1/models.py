from django.db import models


# Create your models here.
class KCNQ1NewVariant(models.Model):
    class Meta:
        managed = False
        app_label = 'azure_data'
        db_table = "KCNQ1_browser_main"

    lqt1 = models.IntegerField(blank=True, null=False, default=0)
    var = models.TextField(primary_key=True, blank=False, null=True)
#    unaff = models.IntegerField(blank=True, null=False, default=0)
#    natAA = models.TextField(blank=True, null=True)
#    mutAA = models.TextField(blank=True, null=True)
    pos = models.TextField(blank=True, null=True)
    ref = models.TextField(blank=True, null=True)
    alt = models.TextField(blank=True, null=True)
    hgvsc = models.TextField(db_column='HGVSc', blank=False, null=True)

    total_carriers = models.IntegerField(blank=True, null=False, default=0)
    resnum = models.IntegerField(blank=True, null=True)
    structure_lqt1 = models.TextField(db_column='Structure', blank=True, null=True)  # Field name made lowercase.
    function_lqt1 = models.TextField(db_column='Function', blank=True, null=True)  # Field name made lowercase.
    lqt1_penetrance = models.IntegerField(db_column='p_mean_w', blank=True, null=True)
    lqt1_dist = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.var

class KCNQ1ClinicalPapers(models.Model):
    class Meta:
        managed = False
        app_label = 'azure_data'
        db_table = 'KCNQ1_clinical_v10'

    id = models.IntegerField(db_column="Columna_1", primary_key=True)
    var = models.TextField(blank=False, null=False)
    car = models.IntegerField(db_column="HET", default=0, blank=True, null=True)
    amb = models.IntegerField(db_column='Ambiguous_Phenotype_Hets', default=0, blank=True, null=True)
    unknown = models.IntegerField(db_column='Unknown_Phenotype_Hets', blank=False, null=False, default=0)
    unaff = models.IntegerField(db_column='Asymptomatic', blank=False, null=False, default=0)
    homozygous = models.IntegerField(db_column="Homozygous_Carriers", default=0, blank=True, null=True)
    compound_hets = models.IntegerField(db_column="Heterozygous_JLNS", default=0, blank=True, null=True)
    jlns = models.IntegerField(db_column="Homo_Schw_LQTS", default=0, blank=True, null=True)
    lqt1 = models.IntegerField(db_column="LQT1", default=0, blank=True, null=True)
    sqts = models.IntegerField(db_column="SQTS", default=0, blank=True, null=True)
    scd = models.TextField(db_column="Sudden_Cardiac_Death", blank=True, null=True)
    sids = models.TextField(db_column="SIDS", blank=True, null=True)
    year = models.TextField(db_column="Year", blank=True, null=True)
    pmid = models.TextField(db_column="PMID", blank=True, null=True)
    other_diag = models.TextField(db_column='Other_Diagnoses_of_Interest', blank=True, null=True)

    def __str__(self):
        return self.var


class KCNQ1FunctionalPapers(models.Model):
    class Meta:
        managed = False
        app_label = 'azure_data'
        db_table = 'KCNQ1_function'

    var = models.TextField(db_column="var", primary_key=True, blank=False, null=False)
    pmid = models.TextField(db_column="PUBMED_ID", blank=True, null=True)
    hm_peak = models.FloatField()
    hm_Vhalfact = models.FloatField()
    hm_deltak = models.FloatField(blank=True, null=True)
    hm_tauact = models.FloatField(blank=True, null=True)
    hm_taudeact = models.FloatField(blank=True, null=True)

    ht_peak = models.FloatField(blank=True, null=True)
    ht_Vhalfact = models.FloatField(blank=True, null=True)
    ht_deltak = models.FloatField(blank=True, null=True)
    ht_tauact = models.FloatField(blank=True, null=True)
    ht_taudeact = models.FloatField(blank=True, null=True)
    cell_type = models.TextField(db_column='Expression', blank=True, null=True)

    def __str__(self):
        return self.var


class KCNQ1InSilico(models.Model):
    class Meta:
        managed = False
        app_label = 'azure_data'
        db_table = 'KCNQ1_varbrowser_in_silico'

    var = models.TextField(db_column="var", blank=False, null=False, primary_key=True)
    hgvsc = models.TextField(db_column='HGVSc', blank=False, null=True)
    pph2_prob = models.FloatField(blank=True, null=True)
    provean_score = models.FloatField(blank=True, null=True)
    blast_pssm = models.IntegerField(blank=True, null=True)
    revel_score = models.FloatField(blank=True, null=True)
    cardiacboost = models.FloatField(blank=True, null=True)

    def __str__(self):
        return self.var


class kcnq1Distances(models.Model):
    class Meta:
        managed = False
        app_label = 'azure_data'
        db_table = "kcnq1_distances"

    #pair_id = models.IntegerField(primary_key=True)
    resnum = models.IntegerField(blank=False, null=False, primary_key=True)
    neighbor = models.IntegerField(blank=False, null=False)
    distance = models.FloatField(blank=False, null=False)

